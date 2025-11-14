import { DarkTheme, ThemeProvider } from "@react-navigation/native";
import { useFonts } from "expo-font";
import { Slot, useRouter } from "expo-router"; // Import Slot and useRouter
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { useEffect, useState } from "react";
import "react-native-reanimated";
import { Platform, View, ActivityIndicator } from "react-native";

import { useColorScheme } from "@/hooks/useColorScheme";
import { AuthProvider, useAuth } from "@/context/AuthContext"; // Import both
import { SafeAreaProvider } from "react-native-safe-area-context";

// Prevent the splash screen from auto-hiding
SplashScreen.preventAutoHideAsync();

// This is our new "gatekeeper" component
function AppGatekeeper() {
  const { isAuthenticated, user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isLoading) {
      return; // Do nothing while the auth state is being determined
    }

    // This logic runs once isLoading is false
    if (isAuthenticated && user) {
      // User is logged in, redirect based on role
      if (user.role === 'admin') {
        router.replace('/(admin)/dashboard' as any);
      } else if (user.role === 'trainer') {
        router.replace('/(trainer)/dashboard' as any);
      } else {
        router.replace('/(tabs)'); // Default for 'user' role
      }
    } else {
      // User is not logged in, send to the welcome screen
      router.replace('/welcome');
    }
  }, [isAuthenticated, isLoading, user]); // Re-run this effect when auth state changes

  // While loading fonts or auth state, show a loading screen
  // This prevents the app from flashing unstyled content
  return <Slot />;
}

const LoadingScreen = () => (
  <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#070F2B' }}>
    <ActivityIndicator size="large" color="#ffffff" />
  </View>
);

export default function RootLayout() {
  const [loaded, error] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
  });

  // Handle font loading
  useEffect(() => {
    if (error) throw error;
  }, [error]);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  // Your service worker logic is fine
  useEffect(() => {
    if (Platform.OS === "web" && "serviceWorker" in navigator) {
      // ... service worker registration
    }
  }, []);

  if (!loaded) {
    return <LoadingScreen />; // Show loading screen while fonts are loading
  }

  // --- This is the main return block ---
  return (
    // 1. AuthProvider wraps everything, making 'useAuth' available everywhere.
    <AuthProvider>
      {/* 2. Your other providers wrap the gatekeeper */}
      <SafeAreaProvider>
        <ThemeProvider value={DarkTheme}>
          {/* 3. The Gatekeeper handles all redirection logic */}
          <AppGatekeeper />
          <StatusBar style="light" />
        </ThemeProvider>
      </SafeAreaProvider>
    </AuthProvider>
  );
}
