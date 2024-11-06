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
} from "react-native";
import * as MediaLibrary from "expo-media-library";
import { HelloWave } from "@/components/HelloWave";
import ParallaxScrollView from "@/components/ParallaxScrollView";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { Audio } from "expo-av";

export default function HomeScreen() {
  const [sound, setSound] = useState<Audio.Sound | undefined>(undefined);

  useEffect(() => {
    return sound
      ? () => {
          console.log('Unloading Sound');
          sound.unloadAsync();
        }
      : undefined;
  }, [sound]);


  async function playSound() {
    console.log("Loading Sound");
    const { sound } = await Audio.Sound.createAsync( require("../../assets/audio/soulsweeper.mp3")
    );
    setSound(sound);

    console.log('Playing Sound');
    await sound.playAsync();
  }


  return (
    <SafeAreaView
      className={`flex-1  ${
        Platform.OS === "android" ? StatusBar.currentHeight : 10
      }`}
    >
      <ScrollView className="flex-1">
        <ThemedText>Home</ThemedText>
        <Button title="Play Sound" onPress={playSound} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({});
