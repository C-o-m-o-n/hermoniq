import { useRouter, useLocalSearchParams  } from "expo-router";
import { useEffect, useState } from "react";
import { View, Text, Button } from "react-native";
import * as MediaLibrary from "expo-media-library";
import { Audio } from "expo-av";

export default function PlayScreen() {
  const { id } = useLocalSearchParams ();
  const [audioFile, setAudioFile] = useState<MediaLibrary.Asset | null>(null);
  const [sound, setSound] = useState<Audio.Sound | null>(null);
  const [audioFiles, setAudioFiles] = useState<MediaLibrary.Asset[]>([]);
  const [currentIndex, setCurrentIndex] = useState<number>(-1);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);

  useEffect(() => {
    loadAudioFiles();
    return () => {
      if (sound) {
        sound.unloadAsync();
      }
    };
  }, []);

  useEffect(() => {
    if (id && audioFiles.length > 0) {
      const index = audioFiles.findIndex(file => file.id === id);
      if (index !== -1) {
        setCurrentIndex(index);
        playSound(audioFiles[index].uri);
      }
    }
  }, [id, audioFiles]);

  const loadAudioFiles = async () => {
    try {
      const media = await MediaLibrary.getAssetsAsync({
        mediaType: MediaLibrary.MediaType.audio,
        first: 100,
      });
      setAudioFiles(media.assets);
    } catch (error) {
      console.error("Error fetching audio files:", error);
    }
  };

  // const loadAudioFile = async () => {
  //   try {
  //     const asset = await MediaLibrary.getAssetInfoAsync(id as string);
  //     setAudioFile(asset);
  //   } catch (error) {
  //     console.error("Error loading audio file:", error);
  //   }
  // };

  const playSound = async (uri: string) => {
    if (sound) {
      await sound.stopAsync();
      await sound.unloadAsync();
    }

    const newSound = new Audio.Sound();
    try {
      await newSound.loadAsync({ uri });
      await newSound.playAsync();
      setSound(newSound);

      // Set playback status update to handle end of playback
      newSound.setOnPlaybackStatusUpdate((status) => {
        if (status.isLoaded && status.didJustFinish) {
          handleNext(); // Automatically play next when current track ends
        }
      });

    } catch (error) {
      console.error("Error playing audio:", error);
    }
  };

  const handlePauseResume = async () => {
    if (sound) {
      if (isPlaying) {
        await sound.pauseAsync();
      } else {
        await sound.playAsync();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleNext = () => {
    if (audioFiles.length > 0 && currentIndex < audioFiles.length - 1) {
      const nextIndex = currentIndex + 1;
      setCurrentIndex(nextIndex);
      playSound(audioFiles[nextIndex].uri);
    }
  };

  const handlePrevious = () => {
    if (audioFiles.length > 0 && currentIndex > 0) {
      const prevIndex = currentIndex - 1;
      setCurrentIndex(prevIndex);
      playSound(audioFiles[prevIndex].uri);
    }
  };

  return (
    <View className="flex-1 h-full pt-12">
      {audioFiles.length > 0 && currentIndex !== -1 ? (
        <>
          <Text>{audioFiles[currentIndex].filename}</Text>
          <Button title={isPlaying ? "Pause" : "Play"} onPress={handlePauseResume} />
          <Button title="Previous" onPress={handlePrevious} disabled={currentIndex === 0} />
          <Button title="Next" onPress={handleNext} disabled={currentIndex === audioFiles.length - 1} />
        </>
      ) : (
        <Text>Loading...</Text>
      )}
    </View>
  );
}
