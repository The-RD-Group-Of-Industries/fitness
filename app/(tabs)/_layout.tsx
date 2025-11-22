import { Tabs } from "expo-router";
import React from "react";
import { Ionicons, FontAwesome, FontAwesome6 } from "@expo/vector-icons";

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false, // Hide headers by default
        tabBarActiveTintColor: '#ffffff',
        tabBarInactiveTintColor: 'gray',
        tabBarStyle: {
          backgroundColor: '#090E21',
          borderTopWidth: 0,
          elevation: 0, // Android shadow removal
          height: 60,   // Optional: Give it a bit more height
          paddingBottom: 8,
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
