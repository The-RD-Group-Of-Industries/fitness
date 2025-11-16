import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { router } from 'expo-router';
import { ThemedView } from '@/components/ThemedView'; // Assuming you have this
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useAuth } from '../../context/AuthContext';

// A reusable component for the dashboard buttons
const DashboardButton = ({ title, icon, onPress, color }) => (
  <TouchableOpacity style={styles.button} onPress={onPress}>
    <MaterialCommunityIcons name={icon} size={48} color={color} />
    <Text style={styles.buttonText}>{title}</Text>
  </TouchableOpacity>
);

export default function AdminDashboard() {
  const { user } = useAuth();

  // Navigation handlers
  const goToCreateTrainer = () => {
    router.push('/(admin)/create-trainer');
  };

  const goToManageUsers = () => {
    router.push('/(admin)/manage-users');
  };

  const goToViewSchedules = () => {
    // router.push('/(admin)/view-schedules'); // You can implement this later
    alert("View Schedules screen not yet implemented.");
  };

  return (
    <ThemedView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Text style={styles.welcomeTitle}>Welcome, Admin</Text>
          <Text style={styles.welcomeSubtitle}>{user?.fullName || ''}</Text>
        </View>

        <View style={styles.grid}>
          <DashboardButton 
            title="Create Trainer"
            icon="account-plus"
            color="#4CAF50"
            onPress={goToCreateTrainer} 
          />
          <DashboardButton 
            title="Manage Users"
            icon="account-group"
            color="#2196F3"
            onPress={goToManageUsers}
          />
          <DashboardButton 
            title="All Schedules"
            icon="calendar-check"
            color="#FFC107"
            onPress={goToViewSchedules}
          />
          {/* Add more buttons here as needed */}
        </View>
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#070F2B', // A darker background for contrast
  },
  scrollContent: {
    padding: 20,
  },
  header: {
    marginBottom: 40,
  },
  welcomeTitle: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  welcomeSubtitle: {
    fontSize: 20,
    color: '#a9a9a9',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  button: {
    backgroundColor: '#0c1742', // Matching your profile card color
    width: '48%', // Two buttons per row
    aspectRatio: 1, // Make it a square
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
    padding: 10,
    // Shadow for depth
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.30,
    shadowRadius: 4.65,
    elevation: 8,
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
    marginTop: 10,
    textAlign: 'center',
  },
});
