import { Tabs } from "expo-router";
import React from "react";
import { Platform, TouchableOpacity } from "react-native";

import { HapticTab } from "@/components/HapticTab";
import { IconSymbol } from "@/components/ui/IconSymbol";
import AntDesign from '@expo/vector-icons/AntDesign';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import TabBarBackground from "@/components/ui/TabBarBackground";
import { Colors } from "@/constants/Colors";
import { useColorScheme } from "@/hooks/useColorScheme";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const navigation = useNavigation();


  const BackButton = () => (
    <TouchableOpacity
      onPress={() => navigation.goBack()}
      style={{ paddingHorizontal: 8 }}
    >
      <Ionicons name="arrow-back" size={24} color={Colors[colorScheme ?? "light"].tint} />
    </TouchableOpacity>
  );
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? "light"].tint,
        headerShown: true,
        
        headerStyle: {
          backgroundColor: '#090E21'
        },
        headerLeft: () => <BackButton />,
        tabBarButton: HapticTab,
        tabBarBackground: TabBarBackground,
        tabBarStyle: Platform.select({
          ios: {
            position: "absolute",
            backgroundColor: Colors[colorScheme ?? "light"].background,
            borderTopWidth: 0,
          },
          android: {
            backgroundColor: "#090E21",
            borderTopWidth: 0,
            elevation: 0,
            
          },
          default: {
            backgroundColor: "#090E21"
          },
        }),
      }}
    >
      <Tabs.Screen
        name="index"
        
        options={{
          title: "Home",
          // tabBarBackground: () => "transparent",
          headerTitle: "Fitness Evolution",
          headerLeft: () => null,
          headerTitleStyle: {
            fontWeight: '800',
            fontSize: 26
          },
          tabBarIcon: ({ color }) => (
            <IconSymbol size={22} name="house.fill" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="explore"
        options={{
          title: "Explore",
          tabBarIcon: ({ color }) => (
            <AntDesign name="search1" size={22} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="workout"
        options={{
          title: "Workouts",
          tabBarIcon: ({ color }) => (
            <FontAwesome6 name="dumbbell" size={22} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          tabBarIcon: ({ color }) => (
          <Ionicons name="person" size={22} color={color} />
        ),
        }}
      />
    </Tabs>
  );
}
