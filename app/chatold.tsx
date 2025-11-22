import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator, TouchableOpacity, Image } from 'react-native';
import { ThemedView } from '@/components/ThemedView';
import apiClient from '@/lib/api';
import { useAuth } from '@/context/AuthContext';
import { router } from 'expo-router';


interface ChatUser {
  _id: string;
  fullName: string;
  role: string;
  image?: string;
}

export default function ChatListScreen() {
  const { isAuthenticated } = useAuth();
  const [users, setUsers] = useState<ChatUser[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchChatUsers = async () => {
      if (!isAuthenticated) return;
      try {
        setLoading(true);
        // We can reuse the /users/trainers and /admin/users endpoints
        // Or create a new dedicated endpoint for chat contacts
        const [trainersRes, adminsRes] = await Promise.all([
            apiClient.get('/v0/api/users/trainers'),
            apiClient.get('/v0/api/admin/users') // Assuming we want users to chat with admins too
        ]);
        
        // Combine and filter out the current user
        const allUsers = [...trainersRes.data, ...adminsRes.data];
        // You would filter out the current user from this list here
        setUsers(allUsers);

      } catch (error) {
        console.error("Failed to fetch chat users:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchChatUsers();
  }, [isAuthenticated]);

  const onUserPress = (user: ChatUser) => {
    // Navigate to a dynamic chat screen, passing user details
    router.push({
      pathname: `/chat/${user._id}`,
      params: { recipientName: user.fullName }
    });
  };

  if (loading) {
    return <ThemedView style={styles.centered}><ActivityIndicator size="large" color="#fff" /></ThemedView>;
  }

  return (
    <ThemedView style={styles.container}>
      <Text style={styles.title}>Conversations</Text>
      <FlatList
        data={users}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.card} onPress={() => onUserPress(item)}>
            <Image 
              source={item.image ? { uri: item.image } : require('@/assets/images/default-profile.png')} 
              style={styles.image}
            />
            <View>
              <Text style={styles.name}>{item.fullName}</Text>
              <Text style={styles.role}>{item.role}</Text>
            </View>
          </TouchableOpacity>
        )}
      />
    </ThemedView>
  );
}

// Use similar styles to your HomeScreen for consistency
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#070F2B' },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  title: { fontSize: 28, fontWeight: 'bold', color: '#fff', marginVertical: 20, paddingHorizontal: 20 },
  card: { backgroundColor: '#0c1742', borderRadius: 12, padding: 15, marginHorizontal: 20, marginBottom: 15, flexDirection: 'row', alignItems: 'center' },
  image: { width: 50, height: 50, borderRadius: 25, marginRight: 15 },
  name: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
  role: { color: 'gray', fontSize: 12, textTransform: 'capitalize', marginTop: 4 },
});
