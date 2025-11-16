import React from 'react';
import { Stack } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { TouchableOpacity } from 'react-native';
import { router } from 'expo-router';

export default function TrainerLayout() {
  return (
    <Stack
      screenOptions={{
        headerStyle: {
          backgroundColor: '#0c1742', // Dark blue header
        },
        headerTintColor: '#fff', // White text and icons
        headerTitleStyle: {
          fontWeight: 'bold',
        },
        // A custom back button
        headerLeft: () => (
            <TouchableOpacity onPress={() => router.back()} style={{ marginLeft: 15 }}>
                <Ionicons name="arrow-back" size={24} color="white" />
            </TouchableOpacity>
        )
      }}
    >
      <Stack.Screen 
        name="dashboard" 
        options={{ 
            title: 'Trainer Dashboard',
            // You can hide the back button on the main dashboard screen
            headerLeft: () => null, 
        }} 
      />
      <Stack.Screen 
        name="[id]" // This refers to the trainer profile screen
        options={{ 
            title: 'Trainer Profile',
        }} 
      />
      {/* Add other trainer-specific screens here as you create them */}
      {/* 
      <Stack.Screen 
        name="create-session" 
        options={{ title: 'Schedule a Client' }} 
      /> 
      */}
    </Stack>
  );
}
