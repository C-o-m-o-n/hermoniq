import { useState, useEffect, useRef } from "react";
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
import { BottomSheet } from "react-native-btr";
import { Link } from "expo-router";
import { useMusic } from "@/components/context/MusicContext";

export default function HomeScreen() {
  const { audioFiles, playSong, setCurrentSongIndex } = useMusic();
  const [sound, setSound] = useState<Audio.Sound | undefined>(undefined);
  // const [audioFiles, setAudioFiles] = useState<MediaLibrary.Asset[]>([]);
  const [currentSong, setCurrentSong] = useState(false);
  // Use a ref to keep track of the current playing sound
const currentSound = useRef<Audio.Sound | null>(null);

  useEffect(() => {
    return sound
      ? () => {
          console.log("Unloading Sound");
          sound.unloadAsync();
        }
      : undefined;
  }, [sound]);

  // async function playSound(uri: string) {
  //   // Stop and unload the current sound if it exists
  //   if (currentSound.current) {
  //     await currentSound.current.stopAsync();
  //     await currentSound.current.unloadAsync();
  //     currentSound.current = null; // Reset the ref
  //   }
  //   console.log("Loading Sound");
  //   const sound = new Audio.Sound();
  //   try {
  //     // Load and play the new sound
  //     await sound.loadAsync({ uri });
  //     await sound.playAsync();
  //     currentSound.current = sound; // Set the ref to the new sound
  //   } catch (error) {
  //     console.error('Error playing audio:', error);
  //   }
  // }
  
  // const requestPermissions = async () => {
  //   const { status } = await MediaLibrary.requestPermissionsAsync();
  //   if (status !== "granted") {
  //     alert("Permission to access media library is required!");
  //     return false;
  //   }
  //   return true;
  // };

  // useEffect(() => {
  //   requestPermissions();
  //   loadAudioFiles();
  // }, []);

  // const loadAudioFiles = async () => {
  //   try {
  //     const media = await MediaLibrary.getAssetsAsync({
  //       mediaType: MediaLibrary.MediaType.audio,
  //       first: 100, // Number of files to fetch
  //     });

  //     setAudioFiles(media.assets);
  //   } catch (error) {
  //     console.error("Error fetching audio files:", error);
  //   }
  // };

  // return (
  //   <SafeAreaView
  //     className={`flex-1  ${
  //       Platform.OS === "android" ? StatusBar.currentHeight : 10
  //     }`}
  //   >
  //     <ScrollView className="flex-1 pt-6">
  //       <View className="bg-red-400 p-2">
  //         {audioFiles.map((file, index) => (
  //           <Link
  //           href={{
  //             pathname: "/(tabs)/[id]",
  //             params: { id: file.id, isCUrrentlyPlaying: "true" }
  //           }}
  //           asChild
  //           key={index}
  //         >
  //          <TouchableOpacity key={index} onPress={() => {playSong(index);}} className="py-4">
  //     <ThemedText>{file.filename}</ThemedText>
  // </TouchableOpacity>
  //         </Link>
            
  //         ))}
  //       </View>

  //     </ScrollView>
  //   </SafeAreaView>
  // );

  return (
    <SafeAreaView className={`flex-1 ${Platform.OS === "android" ? StatusBar.currentHeight : 10}`}>
        <ScrollView className="flex-1 pt-6">
            <View className="bg-red-400 p-2">
                {audioFiles.map((file, index) => (
                    <Link
                        href={{
                            pathname: "/(tabs)/[id]",
                            params: { id: file.id, isCUrrentlyPlaying: "true" },
                        }}
                        asChild
                        key={index}
                    >
                        <TouchableOpacity
                            key={index}
                            onPress={() => {
                                playSong(index);
                                setCurrentSongIndex(index); // Set the current song index
                                console.log("surrent song index", index);
                            }}
                            className="py-4"
                        >
                            <ThemedText>{file.filename}</ThemedText>
                        </TouchableOpacity>
                    </Link>
                ))}
            </View>
        </ScrollView>
    </SafeAreaView>
);

}

const styles = StyleSheet.create({});