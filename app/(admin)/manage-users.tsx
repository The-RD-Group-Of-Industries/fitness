import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator, Image } from 'react-native';
import { ThemedView } from '@/components/ThemedView';
import apiClient from '../../lib/api'; // Make sure the path is correct
import { useAuth } from '../../context/AuthContext';
import { getAllUser } from '../../lib/api';
// Define the type for a user object
interface User {
  _id: string;
  fullName: string;
  email: string;
  role: 'admin' | 'trainer' | 'user';
  image?: string;
}

export default function ManageUsersScreen() {
  const { isAuthenticated } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUsers = async () => {
      // Only fetch if the user is authenticated
      if (!isAuthenticated) return;

      try {
        setLoading(true);
        // Call the new backend endpoint
        const response = await getAllUser();
        if (response.data) {
          setUsers(response.data);
        }
      } catch (err: any) {
        console.log("Error in manage-users.tsx",err)
        setError(err.response?.data?.message || 'Failed to fetch users.');
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [isAuthenticated]);

  // Render a loading spinner while fetching
  if (loading) {
    return (
      <ThemedView style={styles.centered}>
        <ActivityIndicator size="large" color="#ffffff" />
      </ThemedView>
    );
  }

  // Render an error message if something went wrong
  if (error) {
    return (
      <ThemedView style={styles.centered}>
        <Text style={styles.errorText}>{error}</Text>
      </ThemedView>
    );
  }

  // Render the list of users
  return (
    <ThemedView style={styles.container}>
      <Text style={styles.title}>Manage Users</Text>
      <FlatList
        data={users}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          <View style={styles.userCard}>
            <Image 
              source={item.image ? { uri: item.image } : require('../../assets/images/default-profile.png')} 
              style={styles.profileImage}
            />
            <View style={styles.userInfo}>
              <Text style={styles.userName}>{item.fullName}</Text>
              <Text style={styles.userEmail}>{item.email}</Text>
            </View>
            <Text style={[styles.userRole, { color: getRoleColor(item.role) }]}>
              {item.role}
            </Text>
          </View>
        )}
      />
    </ThemedView>
  );
}

// Helper function to color-code the roles
const getRoleColor = (role: string) => {
  switch (role) {
    case 'admin': return '#FFC107'; // Yellow
    case 'trainer': return '#2196F3'; // Blue
    default: return '#a9a9a9'; // Gray
  }
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#070F2B', padding: 10 },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#070F2B' },
  title: { fontSize: 28, fontWeight: 'bold', color: '#fff', marginBottom: 20, paddingHorizontal: 10 },
  errorText: { color: 'red', fontSize: 16 },
  userCard: {
    backgroundColor: '#0c1742',
    borderRadius: 10,
    padding: 15,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  profileImage: { width: 50, height: 50, borderRadius: 25, marginRight: 15 },
  userInfo: { flex: 1 },
  userName: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
  userEmail: { color: 'gray', fontSize: 12 },
  userRole: { fontSize: 14, fontWeight: 'bold', textTransform: 'capitalize' },
});
