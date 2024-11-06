import { useRouter, useLocalSearchParams  } from "expo-router";
import { useEffect, useState } from "react";
import { View, Text, Button } from "react-native";
import * as MediaLibrary from "expo-media-library";
import { Audio } from "expo-av";

export default function PlayScreen() {
  const { id } = useLocalSearchParams ();
  const [audioFile, setAudioFile] = useState<MediaLibrary.Asset | null>(null);
  const [sound, setSound] = useState<Audio.Sound | null>(null);

  useEffect(() => {
    if (id) {
      loadAudioFile();
    }
    return () => {
      if (sound) {
        sound.unloadAsync();
      }
    };
  }, [id]);

  const loadAudioFile = async () => {
    try {
      const asset = await MediaLibrary.getAssetInfoAsync(id as string);
      setAudioFile(asset);
    } catch (error) {
      console.error("Error loading audio file:", error);
    }
  };

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
    } catch (error) {
      console.error("Error playing audio:", error);
    }
  };

  return (
    <View 
     className="bg-green-600 h-full w-full flex-1 items-center justify-center"
     >
      {audioFile ? (
        <>
          <Text>{audioFile.filename}</Text>
          <Button
            title="Play"
            onPress={() => playSound(audioFile.uri)}
          />
        </>
      ) : (
        <Text>Loading...</Text>
      )}
    </View>
  );
}
