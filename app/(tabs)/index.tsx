import { useState, useEffect } from "react";
import {
  Button,
  Text,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Image,
  View,
  Platform,
  StatusBar,
  TouchableOpacity,
} from "react-native";
import * as MediaLibrary from "expo-media-library";
import { HelloWave } from "@/components/HelloWave";
import ParallaxScrollView from "@/components/ParallaxScrollView";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { Audio } from "expo-av";

export default function HomeScreen() {
  const [sound, setSound] = useState<Audio.Sound | undefined>(undefined);
  const [audioFiles, setAudioFiles] = useState<MediaLibrary.Asset[]>([]);
  const [currentSong, setCurrentSong] = useState(false);
  

  useEffect(() => {
    return sound
      ? () => {
          console.log("Unloading Sound");
          sound.unloadAsync();
        }
      : undefined;
  }, [sound]);

  async function playSound(uri: string) {
    console.log("Loading Sound");
    const sound = new Audio.Sound();
    try {
      await sound.loadAsync({ uri });
      await sound.playAsync();
    } catch (error) {
      console.error('Error playing audio:', error);
    }
  }

  const requestPermissions = async () => {
    const { status } = await MediaLibrary.requestPermissionsAsync();
    if (status !== "granted") {
      alert("Permission to access media library is required!");
      return false;
    }
    return true;
  };

  useEffect(() => {
    requestPermissions();
    loadAudioFiles();
  }, []);

  const loadAudioFiles = async () => {
    try {
      const media = await MediaLibrary.getAssetsAsync({
        mediaType: MediaLibrary.MediaType.audio,
        first: 100, // Number of files to fetch
      });

      setAudioFiles(media.assets);
    } catch (error) {
      console.error("Error fetching audio files:", error);
    }
  };

  return (
    <SafeAreaView
      className={`flex-1  ${
        Platform.OS === "android" ? StatusBar.currentHeight : 10
      }`}
    >
      <ScrollView className="flex-1 pt-6">
        <ThemedText>Home</ThemedText>

        <View className="bg-red-400 p-2">
          {audioFiles.map((file, index) => (
            <TouchableOpacity onPress={() => playSound(file.uri)} className="py-4" key={index}>
              <ThemedText>{file.filename}</ThemedText>
            </TouchableOpacity>
          ))}
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({});
