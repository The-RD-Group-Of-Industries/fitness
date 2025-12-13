import { Tabs } from "expo-router";
import React from "react";
import { Ionicons, FontAwesome, FontAwesome6 } from "@expo/vector-icons";
// 1. Import the safe area hook
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function TabLayout() {
  // 2. Get the safe area insets (this contains the height of the system navigation bar)
  const insets = useSafeAreaInsets();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#ffffff',
        tabBarInactiveTintColor: 'gray',
        tabBarStyle: {
          backgroundColor: '#090E21',
          borderTopWidth: 0,
          elevation: 0,
          // 3. Dynamically set height: Base height (60) + System Navigation Bar height
          height: 60 + insets.bottom,
          // 4. Dynamically set padding: Push content up above the System Navigation Bar
          // We add a small buffer (5px) so it's not glued to the very bottom
          paddingBottom: insets.bottom + 5,
          paddingTop: 5, // Add a little top padding to center the icons vertically
        },
        tabBarLabelStyle: {
           fontSize: 12,
           fontWeight: '600'
        }
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ color }) => <FontAwesome name="home" size={28} color={color} />,
        }}
      />
      
      <Tabs.Screen
        name="explore"
        options={{
          title: "Explore",
          tabBarIcon: ({ color }) => <FontAwesome name="globe" size={24} color={color} />,
        }}
      />

      {/* Ensure 'workouts.tsx' exists in app/(tabs)/ */}
      <Tabs.Screen
        name="workouts" 
        options={{
          title: "Workouts",
          tabBarIcon: ({ color }) => <FontAwesome6 name="dumbbell" size={22} color={color} />,
        }}
      />

      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          tabBarIcon: ({ color }) => <Ionicons name="person" size={24} color={color} />,
        }}
      />
    </Tabs>
  );
}
