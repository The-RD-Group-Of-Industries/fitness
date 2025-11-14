import React from 'react';
import { Stack } from 'expo-router';
import { useAuth } from '../../context/AuthContext'; // Adjust path if needed
import { TouchableOpacity } from 'react-native';
import { SimpleLineIcons } from '@expo/vector-icons';
import { router } from 'expo-router';

export default function AdminLayout() {
  const { logout } = useAuth();

  const handleLogout = () => {
    logout();
  };

  return (
    <Stack
      screenOptions={{
        // --- Header Styling ---
        headerStyle: {
          backgroundColor: '#0c1742', // Using the dark blue from your profile page
        },
        headerTintColor: '#ffffff', // White text for titles and back buttons
        headerTitleStyle: {
          fontWeight: 'bold',
        },
        // --- Header Right Button (Logout) ---
        headerRight: () => (
          <TouchableOpacity onPress={handleLogout} style={{ marginRight: 15 }}>
            <SimpleLineIcons name="logout" size={22} color="orange" />
          </TouchableOpacity>
        ),
      }}
    >
      <Stack.Screen 
        name="dashboard" 
        options={{ 
          title: 'Admin Dashboard',
        }} 
      />
      <Stack.Screen 
        name="create-trainer" 
        options={{ 
          title: 'Create New Trainer',
          presentation: 'modal', // This makes it slide up from the bottom
        }} 
      />
      {/* 
        You can add more screens here as you build them.
        For example:
        <Stack.Screen 
          name="manage-users" 
          options={{ title: 'Manage Users' }} 
        />
      */}
    </Stack>
  );
}
