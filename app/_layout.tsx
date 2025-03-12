import { DarkTheme, DefaultTheme, ThemeProvider } from "@react-navigation/native"
import { useFonts } from "expo-font"
import { Stack } from "expo-router"
import * as SplashScreen from "expo-splash-screen"
import { StatusBar } from "expo-status-bar"
import { useEffect, useState } from "react"
import "react-native-reanimated"
import { Platform, Text, View } from "react-native";
import * as Linking from "expo-linking";

import { useColorScheme } from "@/hooks/useColorScheme"
import { AuthProvider } from "@/context/AuthContext"

const InstallInstructions = () => {
  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text style={{ fontSize: 18, fontWeight: "bold", textAlign: "center" }}>
        To install this app:
      </Text>
      <Text>1. Tap the Share button in Safari.</Text>
      <Text>2. Select "Add to Home Screen".</Text>
    </View>
  );
};


SplashScreen.preventAutoHideAsync()

export default function RootLayout() {
  const [showInstallPage, setShowInstallPage] = useState(false);
  
  useEffect(() => {
    const checkForInstallParam = async () => {
      const initialUrl = await Linking.getInitialURL();
      if (initialUrl && initialUrl.includes("install=true")) {
        setShowInstallPage(true);
      }
    };

    checkForInstallParam();
  }, []);
  
  
  const colorScheme = useColorScheme()
  const [loaded] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
  })

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync()
    }
  }, [loaded])


  useEffect(() => {
    if (Platform.OS === "web" && "serviceWorker" in navigator) {
      navigator.serviceWorker
        .register("/service-worker.js")
        .then(() => console.log("Service Worker Registered"))
        .catch((err) => console.log("Service Worker Registration Failed:", err));
    }
  }, []);

  if (!loaded) {
    return null
  }

  return showInstallPage ? <InstallInstructions /> : (
    <AuthProvider>
      <ThemeProvider value={DarkTheme}>
        <Stack>
          <Stack.Screen name="welcome" options={{ headerShown: false }} />
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="auth" options={{ headerShown: false }} />
          <Stack.Screen name="session/index" options={{ headerShown: true }} />
          <Stack.Screen name="chats/[trainerId]" options={{ headerShown: true }} />
          <Stack.Screen name="+not-found" />
        </Stack>
        <StatusBar style="auto" />
      </ThemeProvider>
    </AuthProvider>
  )
}