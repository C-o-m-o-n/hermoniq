import { View, Text, TouchableOpacity, ImageBackground } from "react-native";
import { useMusic, MusicProvider } from "@/components/context/MusicContext";
import Slider from "@react-native-community/slider";
import Ionicons from "@expo/vector-icons/build/Ionicons";
import AntDesign from "@expo/vector-icons/AntDesign";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { FontAwesome, FontAwesome6 } from "@expo/vector-icons";
import { useLocalSearchParams, router } from "expo-router";

export default function PlayScreen() {
  const { audioFiles, currentSongIndex, isPlaying, handleSeek, positionMillis, durationMillis, pauseSong, resumeSong, nextSong, prevSong, audioFilesLoading, audioFilesError  } = useMusic();
console.log("audioFiles", audioFiles);
console.log("currentSongIndex", currentSongIndex);

//   if (currentSongIndex === -1 || audioFiles.length === 0) {
//     return <Text>Loading...</Text>;
// }

// if (!audioFiles[currentSongIndex]) { //Conditional rendering added here.
//     return <Text>Loading...</Text>;
// }

if (audioFilesLoading) {
  return <Text>Loading audio files...</Text>;
}

if (audioFilesError) {
  return <Text>Error: {audioFilesError}</Text>;
}

if (currentSongIndex === -1 || audioFiles.length === 0) {
  return <Text>Loading song...</Text>;
}

if (!audioFiles[currentSongIndex]) {
  return <Text>Loading song...</Text>;
}
  // Function to format milliseconds into hh:mm:ss
  const formatTime = (millis: number) => {
    const totalSeconds = Math.floor(millis / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    const hoursDisplay = hours > 0 ? `${hours}:` : ""; // Include hours only if greater than 0
    const minutesDisplay = `${minutes < 10 && hours > 0 ? "0" : ""}${minutes}:`; // Pad minutes if hours are shown
    const secondsDisplay = `${seconds < 10 ? "0" : ""}${seconds}`; // Pad seconds with leading zero

    return `${hoursDisplay}${minutesDisplay}${secondsDisplay}`;
  };

  return (
    <View className="h-full">
      <ImageBackground
        source={{ uri: "https://images.unsplash.com/photo-1730541843784-09aceb8a1b63?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3" }}
        resizeMode="cover"
        className="flex-1 py-6 justify-between"
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


          <Text className="text-white text-center">
                    {audioFiles[currentSongIndex].filename}
                </Text>

        <View>
        <Text className="text-white text-center">
                    {audioFiles[currentSongIndex].filename}
                </Text>

             <View className="pt-4">
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
             <View className="pl-4">
              <Text className="text-white">
              {formatTime(positionMillis)} / {formatTime(durationMillis)}
            </Text>
              </View>
             </View>

          <View className="flex flex-row items-center justify-between px-12">
               <FontAwesome name="random" size={24} color="white" />
                 <Ionicons
                  onPress={prevSong}
                  // disabled={currentIndex === 0}
                  name="play-skip-back"
                  size={24}
                  color="white"
                />

          {isPlaying ? (

            <TouchableOpacity onPress={pauseSong}>
            <Ionicons
              className="p-4 bg-[#FFAE00] rounded-full items-center"
              name="pause"
              size={24}
              color="white"
            />
          </TouchableOpacity>

          ) : (

<TouchableOpacity onPress={resumeSong}>
<Ionicons
  className="p-4 bg-[#FFAE00] rounded-full items-center"
  name="play"
  size={24}
  color="white"
/>
</TouchableOpacity>
          )}
          <Ionicons
                   onPress={nextSong}
                  // disabled={currentIndex === audioFiles.length - 1}
                  name="play-skip-forward"
                  size={24}
                  color="white"
                />

              <FontAwesome6 name="repeat" size={24} color="white" />
            </View>

            <View className="flex flex-row justify-between items-center px-4">
              <AntDesign name="sharealt" size={24} color="white" />
              <Ionicons name="list" size={24} color="white" />
            </View>


      </ImageBackground>
    </View>
  );
}
