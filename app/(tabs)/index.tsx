import React, { useState, useEffect } from 'react';
import { 
    View, 
    Text, 
    StyleSheet, 
    FlatList, 
    ActivityIndicator, 
    TouchableOpacity, 
    Image,
    SafeAreaView
} from 'react-native';
import { ThemedView } from '@/components/ThemedView';
import { useAuth } from '@/context/AuthContext';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { getAllTrainers } from '@/lib/api';

// Define a type for the Trainer object
interface Trainer {
  _id: string;
  fullName: string;
  email: string;
  image?: string;
  specialization?: string;
}

export default function HomeScreen() {
  const { isAuthenticated, isLoading: isAuthLoading } = useAuth();
  const [trainers, setTrainers] = useState<Trainer[]>([]);
  const [isFetching, setIsFetching] = useState(true); // Start as true to show initial loader

  const fetchTrainers = async () => {
    if (!isAuthenticated) return;
    try {
      setIsFetching(true);
      const response = await getAllTrainers();
      setTrainers(response.data);
    } catch (error) {
      console.error("Failed to fetch trainers:", error);
      // In a real app, you would show a toast message here
    } finally {
      setIsFetching(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchTrainers();
    } else if (!isAuthLoading) {
        // If auth is checked and user is not authenticated, stop fetching
        setIsFetching(false);
    }
  }, [isAuthenticated, isAuthLoading]);

  const onTrainerPress = (id: string) => {
    router.push(`/trainer/${id}`);
  };

  // Main render function
  return (
    <SafeAreaView style={styles.safeArea}>
      <ThemedView style={styles.container}>
        {/* --- Header Section - Always Visible --- */}
        <View style={styles.header}>
            <Text style={styles.title}>Find Your Trainer</Text>
            <Text style={styles.subtitle}>
              Browse our certified professionals to start your personalized fitness journey.
            </Text>
        </View>

        {/* --- Content Section - Conditionally Rendered --- */}
        {isFetching ? (
          <View style={styles.centeredContainer}>
            <ActivityIndicator size="large" color="#4CAF50" />
          </View>
        ) : trainers.length > 0 ? (
          <FlatList
            data={trainers}
            keyExtractor={(item) => item._id}
            renderItem={({ item }) => (
              <TouchableOpacity style={styles.card} onPress={() => onTrainerPress(item._id)}>
                <Image 
                  source={item.image ? { uri: item.image } : require('@/assets/images/default-profile.png')} 
                  style={styles.image}
                />
                <View style={styles.infoContainer}>
                  <Text style={styles.name}>{item.fullName}</Text>
                  {item.specialization && <Text style={styles.specialization}>{item.specialization}</Text>}
                </View>
                <Ionicons name="chevron-forward" size={24} color="#4A5568" />
              </TouchableOpacity>
            )}
            onRefresh={fetchTrainers}
            refreshing={isFetching}
          />
        ) : (
          <View style={styles.centeredContainer}>
            <Ionicons name="people-outline" size={60} color="#4A5568" />
            <Text style={styles.emptyText}>No Trainers Available</Text>
            <Text style={styles.emptySubtext}>Please check back later.</Text>
          </View>
        )}
      </ThemedView>
    </SafeAreaView>
  );
}

// Stylesheet
const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#070F2B',
  },
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  subtitle: {
    fontSize: 16,
    color: '#A0AEC0',
    marginTop: 8,
  },
  centeredContainer: { 
    flex: 1, 
    justifyContent: 'center', 
    alignItems: 'center',
    paddingBottom: 50, // Nudge up from the tab bar
  },
  card: { 
    backgroundColor: '#1A202C',
    borderRadius: 12, 
    padding: 15, 
    marginHorizontal: 20,
    marginBottom: 15, 
    flexDirection: 'row', 
    alignItems: 'center',
  },
  image: { 
    width: 60, 
    height: 60, 
    borderRadius: 30, 
    marginRight: 15,
    borderWidth: 2,
    borderColor: '#4CAF50',
  },
  infoContainer: {
    flex: 1,
  },
  name: { 
    color: '#FFFFFF', 
    fontSize: 18, 
    fontWeight: '600',
  },
  specialization: {
    color: '#A0AEC0',
    fontSize: 14,
    marginTop: 4,
  },
  emptyText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
    marginTop: 15,
  },
  emptySubtext: {
    color: '#A0AEC0',
    fontSize: 14,
    marginTop: 5,
    textAlign: 'center',
    paddingHorizontal: 40,
  },
});

