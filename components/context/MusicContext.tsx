import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import * as MediaLibrary from 'expo-media-library';
import { Audio } from 'expo-av';

type MusicContextType = {
  audioFiles: MediaLibrary.Asset[];
  currentSongIndex: number;
  positionMillis: number;
  durationMillis: number;
  isPlaying: boolean;
  handleSeek: (value: number) => void;
  playSong: (index: number) => void;
  pauseSong: () => void;
  resumeSong: () => void;
  nextSong: () => void;
  prevSong: () => void;
  setCurrentSongIndex: (index: number) => void; 
  audioFilesLoading: boolean; // Add loading state
    audioFilesError: string | null; // Add error state
};


const MusicContext = createContext<MusicContextType | undefined>(undefined);

export const MusicProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [audioFiles, setAudioFiles] = useState<MediaLibrary.Asset[]>([]);
  const [currentSongIndex, setCurrentSongIndex] = useState(-1);
  const [isPlaying, setIsPlaying] = useState(false);
  const [positionMillis, setPositionMillis] = useState<number>(0);
  const [durationMillis, setDurationMillis] = useState<number>(1);
  const [progressInterval, setProgressInterval] = useState<NodeJS.Timeout | null>(null);

  const [audioFilesLoading, setAudioFilesLoading] = useState(true); // Initial loading state
  const [audioFilesError, setAudioFilesError] = useState<string | null>(null);

  const sound = useRef<Audio.Sound | null>(null);

  useEffect(() => {
    loadAudioFiles();
    return () => {
      sound.current?.unloadAsync();
      if (progressInterval) clearInterval(progressInterval);
    };
  }, []);

  const loadAudioFiles = async () => {
    setAudioFilesLoading(true); // Set loading to true
    try {
        const { status } = await MediaLibrary.requestPermissionsAsync();
        if (status !== 'granted') {
            alert('Media library access is required!');
            setAudioFilesError('Media library permission denied.');
            return;
        }
        const media = await MediaLibrary.getAssetsAsync({ mediaType: MediaLibrary.MediaType.audio });
        setAudioFiles(media.assets);
        setAudioFilesError(null);
    } catch (error) {
        console.error('Error loading audio files:', error);
        setAudioFilesError('Failed to load audio files.');
    } finally {
        setAudioFilesLoading(false); // Set loading to false
    }
};

  const playSong = async (index: number) => {
    if (sound.current) {
      await sound.current.stopAsync();
      await sound.current.unloadAsync();
      if (progressInterval) clearInterval(progressInterval);
    }

    const newSound = new Audio.Sound();
    await newSound.loadAsync({ uri: audioFiles[index].uri });
    await newSound.playAsync();
    sound.current = newSound;
    setCurrentSongIndex(index);
    setIsPlaying(true);

    sound.current.setOnPlaybackStatusUpdate((status) => {
      if (status.isLoaded) {
          setPositionMillis(status.positionMillis);
          if (status.durationMillis) {
              setDurationMillis(status.durationMillis);
          }

          if (status.didJustFinish) {
              setIsPlaying(false);
              nextSong(); // Play the next track when current ends
          }
      }
  });

  // Add progress interval
  const interval = setInterval(async () => {
      if (sound.current && isPlaying) {
          const status = await sound.current.getStatusAsync();
          if (status.isLoaded) {
              setPositionMillis(status.positionMillis);
          }
      }
  }, 1000); // Update every 1 second
  setProgressInterval(interval);

  return () => {
      clearInterval(interval);
  };
  };

  const handleSeek = async (value: number) => {
    if (sound.current) {
      await sound.current.setPositionAsync(value);
      setPositionMillis(value); // Update the UI immediately after seeking
    }
  };

  const pauseSong = async () => {
    if (sound.current && isPlaying) {
      await sound.current.pauseAsync();
      setIsPlaying(false);
    }
  };

  const resumeSong = async () => {
    if (sound.current && !isPlaying) {
      await sound.current.playAsync();
      setIsPlaying(true);
    }
  };

  const nextSong = () => {
    if (currentSongIndex < audioFiles.length - 1) {
        playSong(currentSongIndex + 1);
    } else {
        playSong(0); // Loop back to the first song
    }
};

  const prevSong = () => {
    if (currentSongIndex > 0) {
      playSong(currentSongIndex - 1);
    } else {
      playSong(audioFiles.length - 1); // Loop back to the last song
    }
  };

  return (
    <MusicContext.Provider
      value={{
        audioFiles,
        currentSongIndex,
        isPlaying,
        handleSeek,
        positionMillis,
        durationMillis,
        playSong,
        pauseSong,
        resumeSong,
        nextSong,
        prevSong,
        setCurrentSongIndex: setCurrentSongIndex,
        audioFilesLoading,
                audioFilesError,
      }}
    >
      {children}
    </MusicContext.Provider>
  );
};

export const useMusic = () => {
  const context = useContext(MusicContext);
  if (!context) {
    throw new Error('useMusic must be used within a MusicProvider');
  }
  return context;
};
