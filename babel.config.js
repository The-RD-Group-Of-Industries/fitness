module.exports = {
  presets: ['babel-preset-expo'],
  plugins: [
    'react-native-worklets/plugin', // Required for Expo SDK 54 and new expo-router
    // Add other plugins as needed
  ],
};
