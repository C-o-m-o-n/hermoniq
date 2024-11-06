import { useRouter, useLocalSearchParams, router } from "expo-router";
import { useEffect, useState } from "react";
import {
  View,
  Text,
  Button,
  Touchable,
  TouchableOpacity,
  ImageBackground,
} from "react-native";
import Slider from "@react-native-community/slider";

import * as MediaLibrary from "expo-media-library";
import { Audio } from "expo-av";
import AntDesign from "@expo/vector-icons/AntDesign";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import Ionicons from "@expo/vector-icons/build/Ionicons";
import { FontAwesome, FontAwesome6 } from "@expo/vector-icons";

export default function PlayScreen() {
  const { id, isCUrrentlyPlaying } = useLocalSearchParams();

  const [audioFile, setAudioFile] = useState<MediaLibrary.Asset | null>(null);
  const [sound, setSound] = useState<Audio.Sound | null>(null);
  const [audioFiles, setAudioFiles] = useState<MediaLibrary.Asset[]>([]);
  const [currentIndex, setCurrentIndex] = useState<number>(-1);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [positionMillis, setPositionMillis] = useState<number>(0);
  const [durationMillis, setDurationMillis] = useState<number>(1);

  useEffect(() => {
    if (isCUrrentlyPlaying) {
      setIsPlaying(true);
    }

    loadAudioFiles();
    return () => {
      if (sound) {
        sound.unloadAsync();
      }
      if (progressInterval) {
        clearInterval(progressInterval);
      }
    };
  }, []);

  useEffect(() => {
    if (id && audioFiles.length > 0) {
      const index = audioFiles.findIndex((file) => file.id === id);
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

  // Change this line
  let progressInterval: NodeJS.Timeout | null = null;

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
        if (status.isLoaded) {
          console.log("status.positionMillis", status.positionMillis);
          setPositionMillis(status.positionMillis);
          if (status.durationMillis) {
            setDurationMillis(status.durationMillis);
          }

          if (status.didJustFinish) {
            handleNext(); // Automatically play next when current track ends
          }
        }
      });

      // Start the interval to update the position during playback
      progressInterval = setInterval(async () => {
        if (newSound && isPlaying) {
          const status = await newSound.getStatusAsync();
          if (status.isLoaded) {
            setPositionMillis(status.positionMillis);
          }
        }
      }, 500); // Update every 500 milliseconds
    } catch (error) {
      console.error("Error playing audio:", error);
    }
  };

  const handlePauseResume = async () => {
    if (sound) {
      if (isPlaying) {
        await sound.pauseAsync();
        if (progressInterval) {
          clearInterval(progressInterval);
        }
      } else {
        await sound.playAsync();
        progressInterval = setInterval(async () => {
          if (sound && isPlaying) {
            const status = await sound.getStatusAsync();
            if (status.isLoaded) {
              setPositionMillis(status.positionMillis);
            }
          }
        }, 500); // Update every 500 milliseconds
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

  const handleSeek = async (value: number) => {
    if (sound) {
      await sound.setPositionAsync(value);
    }
  };

  const bgImageUri = {
    uri: "https://images.unsplash.com/photo-1730541843784-09aceb8a1b63?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxmZWF0dXJlZC1waG90b3MtZmVlZHwyM3x8fGVufDB8fHx8fA%3D%3D",
  };
  // const bgImageUri = {uri: "https://images.unsplash.com/photo-1727915325711-5fdfb5a0a55c?q=80&w=2096&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"}
  return (
    <View className="h-full">
      {audioFiles.length > 0 && currentIndex !== -1 ? (
        <ImageBackground
          source={bgImageUri}
          resizeMode="cover"
          className="flex-1 pt-6 justify-between"
        >
          <View className="flex flex-row items-center justify-between px-4">
            <TouchableOpacity onPress={() => router.back()}>
              <AntDesign
                className="p-2 rounded-full bg-black/50"
                name="left"
                size={24}
                color="white"
              />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => router.back()}>
              <MaterialIcons
                className="p-2 rounded-full bg-black/50"
                name="more-vert"
                size={24}
                color="white"
              />
            </TouchableOpacity>
          </View>

          <View>
            <Text className="text-white text-center">
              {audioFiles[currentIndex].filename}
            </Text>

            <View className="py-4">
              <Slider
                minimumValue={0}
                maximumValue={durationMillis}
                value={positionMillis}
                onValueChange={handleSeek}
                minimumTrackTintColor="#FFAE00"
                maximumTrackTintColor="#D3D3D3"
                thumbTintColor="#FFAE00"
              />
            </View>

            <Text className="text-white">
              {Math.floor(positionMillis / 100000)}s /{" "}
              {Math.floor(durationMillis / 100000)}s
            </Text>

            <View className="flex flex-row items-center justify-between px-12">
              <FontAwesome name="random" size={24} color="white" />

              <View className="flex flex-row items-center justify-between gap-2">
                <Ionicons
                  onPress={handlePrevious}
                  disabled={currentIndex === 0}
                  name="play-skip-back"
                  size={24}
                  color="white"
                />
                {isPlaying ? (
                  <TouchableOpacity onPress={handlePauseResume}>
                    <Ionicons
                      className="p-4 bg-[#FFAE00] rounded-full items-center"
                      name="pause"
                      size={24}
                      color="white"
                    />
                  </TouchableOpacity>
                ) : (
                  <TouchableOpacity onPress={handlePauseResume}>
                    <Ionicons
                      className="p-4 bg-[#FFAE00] rounded-full items-center"
                      name="play"
                      size={24}
                      color="white"
                    />
                  </TouchableOpacity>
                )}

                <Ionicons
                  onPress={handleNext}
                  disabled={currentIndex === audioFiles.length - 1}
                  name="play-skip-forward"
                  size={24}
                  color="white"
                />
              </View>

              <FontAwesome6 name="repeat" size={24} color="white" />
            </View>

            <View className="flex flex-row justify-between items-center px-4">
              <AntDesign name="sharealt" size={24} color="white" />
              <Ionicons name="list" size={24} color="white" />
            </View>
          </View>
        </ImageBackground>
      ) : (
        <Text>Loading...</Text>
      )}
    </View>
  );
}
