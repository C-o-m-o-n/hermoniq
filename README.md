# 🎵 Hermoniq Music App

Hermoniq is a music playback app built with React Native, Expo, and TypeScript. It allows users to browse, play, and control audio files with a smooth user interface, leveraging a custom `useAudioPlayer` hook for enhanced playback functionality.

## 📋 Features

- **Audio Playback**: Load, play, pause, and seek audio files with ease.
- **Track Control**: Skip, rewind, and resume functionality with a reactive progress bar.
- **User Interface**: Styled with an attractive background and intuitive icons for controls.
- **Playback Progress**: Real-time progress update for current track.
- **Playlist Management**: Browse multiple audio files stored on the device.

## 📦 Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/yourusername/hermoniq.git
   cd hermoniq
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Run on an emulator or physical device:**
   ```bash
   npx expo start
   ```

> **Note**: Ensure you have [Expo CLI](https://docs.expo.dev/get-started/installation/) and [Node.js](https://nodejs.org/) installed.

## 🚀 Usage

1. **Select a Track**: Browse your device's audio files and select a track to play.
2. **Playback Controls**: Use the play, pause, skip, and previous buttons to control playback.
3. **Seek Functionality**: Drag the slider to seek within the track.
4. **Playback Progress**: View real-time track progress and duration.

## 🎛️ Code Overview

The core of Hermoniq’s playback functionality is powered by the `useAudioPlayer` hook, which handles loading, playing, pausing, and stopping audio files. Here’s a brief overview of the main components:

### Components

- **PlayScreen**: Displays the audio player UI, including playback controls, track info, and background image.
- **useAudioPlayer Hook**: Manages the audio playback lifecycle, including loading, playback status updates, and cleanup.

### Dependencies

- `expo-av`: Provides audio playback capabilities.
- `expo-media-library`: Manages device audio files.
- `@react-native-community/slider`: Customizable slider component for seeking within the track.

### Key Files

- `PlayScreen.tsx`: The main playback screen component.
- `useAudioPlayer.ts`: Custom React hook to manage audio playback functionality.

## 🎨 Screenshots

![Hermoniq Screenshot](https://via.placeholder.com/300x600)  
*(Replace with actual screenshots)*

## 🛠️ Development

1. **Start the development server:**
   ```bash
   npx expo start
   ```

2. **Run on iOS or Android emulator:**
   - iOS: Press `i` on the Expo CLI.
   - Android: Press `a` on the Expo CLI.

3. **Building for production**: Follow [Expo’s build documentation](https://docs.expo.dev/build/introduction/) for more details on creating production-ready builds.

## 🤝 Contributing

1. Fork the repository.
2. Create a new branch (`git checkout -b feature/new-feature`).
3. Commit your changes (`git commit -am 'Add new feature'`).
4. Push to the branch (`git push origin feature/new-feature`).
5. Open a pull request.

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

Happy coding with Hermoniq! 🎶
