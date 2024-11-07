import { useRef, useState, useEffect } from "react";
import { Audio } from "expo-av";

export const useAudioPlayer = () => {
  const soundRef = useRef<Audio.Sound | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [positionMillis, setPositionMillis] = useState(0);
  const [durationMillis, setDurationMillis] = useState(1);

  const playSound = async (uri: string) => {
    // Stop and unload current sound if it exists
    if (soundRef.current) {
      await soundRef.current.stopAsync();
      await soundRef.current.unloadAsync();
      soundRef.current = null;
    }

    // Load and play the new sound
    const sound = new Audio.Sound();
    await sound.loadAsync({ uri });
    await sound.playAsync();
    soundRef.current = sound;
    setIsPlaying(true);

    // Set playback status update to handle progress and end
    sound.setOnPlaybackStatusUpdate((status) => {
      if (status.isLoaded) {
        setPositionMillis(status.positionMillis || 0);
        setDurationMillis(status.durationMillis || 1);
        if (status.didJustFinish) {
          setIsPlaying(false);
        }
      }
    });
  };

  const handlePauseResume = async () => {
    if (soundRef.current) {
      if (isPlaying) {
        await soundRef.current.pauseAsync();
      } else {
        await soundRef.current.playAsync();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const stopSound = async () => {
    if (soundRef.current) {
      await soundRef.current.stopAsync();
      await soundRef.current.unloadAsync();
      soundRef.current = null;
      setIsPlaying(false);
      setPositionMillis(0);
    }
  };

  return {
    playSound,
    handlePauseResume,
    stopSound,
    isPlaying,
    positionMillis,
    durationMillis,
  };
};
