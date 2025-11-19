import { Tabs } from "expo-router";
import React from "react";
import { AntDesign, FontAwesome6, Ionicons, FontAwesome } from "@expo/vector-icons"; // Added FontAwesome

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        // ---- Global settings for all tabs ----
        headerShown: false, // Hide headers by default, let pages manage their own
        tabBarActiveTintColor: '#ffffff',
        tabBarInactiveTintColor: 'gray',
        tabBarStyle: {
          backgroundColor: '#090E21', // Your app's background color
          borderTopWidth: 0,        // Remove the top border line
        },
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
          tabBarIcon: ({ color }) => <AntDesign name="search1" size={24} color={color} />,
        }}
      />
      {/* ---- The "Workouts" tab is now enabled ---- */}
      <Tabs.Screen
        name="workouts" // Ensure you have a file named 'workouts.tsx' in this folder
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

       {/* --- This part is important to hide other pages from the tab bar --- */}
       <Tabs.Screen
        name="chat"
        options={{
          href: null, // Hides this tab from the bar
        }}
      />
      <Tabs.Screen
        name="chat/[id]"
        options={{
          href: null, // Hides this tab from the bar
        }}
      />
    </Tabs>
  );
}
