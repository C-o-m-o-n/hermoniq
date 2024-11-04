import { useState, useEffect } from 'react';
import { Button, Text, SafeAreaView, ScrollView, StyleSheet, Image, View, Platform, StatusBar } from 'react-native';
import * as MediaLibrary from 'expo-media-library';
import { HelloWave } from '@/components/HelloWave';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
// import "./../../native.css";
export default function HomeScreen() {
  return (
    <View className="flex-1 justify-center items-center bg-white">
      <Text className="text-lg">Open up App.js to start working on your app!</Text>
      <Text>hello</Text>
    </View>
  );
}
