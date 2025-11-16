import React, { useState, useEffect } from 'react';
import { 
    View, 
    Text, 
    StyleSheet, 
    ActivityIndicator, 
    Image, 
    TouchableOpacity, 
    Alert, 
    Modal, 
    Button,
    TextInput,
    Platform
} from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { ThemedView } from '@/components/ThemedView';
// Import apiClient directly
import apiClient from '@/lib/api'; 
import DateTimePicker from '@react-native-community/datetimepicker';
import { Ionicons } from '@expo/vector-icons';

interface Trainer {
  _id: string;
  fullName: string;
  email: string;
  image?: string;
}

export default function TrainerProfileScreen() {
  // You correctly define 'trainerId' here
  const { id: trainerId } = useLocalSearchParams<{ id: string }>(); 
  const [trainer, setTrainer] = useState<Trainer | null>(null);
  const [loading, setLoading] = useState(true);
  
  const [modalVisible, setModalVisible] = useState(false);
  const [sessionDateTime, setSessionDateTime] = useState(new Date());
  const [scheduleSubject, setScheduleSubject] = useState('');
  const [affectedArea, setAffectedArea] = useState('');
  const [isBooking, setIsBooking] = useState(false);
  const [showPicker, setShowPicker] = useState(false);

  // --- Fetch Trainer Details ---
  useEffect(() => {
    // --- FIX #1: Use 'trainerId' instead of 'id' ---
    if (!trainerId) {
      setLoading(false);
      return;
    }

    const fetchTrainer = async () => {
      try {
        setLoading(true);
        // --- FIX #2: Call the correct API endpoint and pass the trainerId ---
        const response = await apiClient.get(`/v0/api/user/trainers/${trainerId}`);
        setTrainer(response.data);
      } catch (error) {
        console.error("Failed to fetch trainer details:", error);
        Alert.alert("Error", "Could not load trainer details.");
      } finally {
        setLoading(false);
      }
    };

    fetchTrainer();
  // --- FIX #3: Use 'trainerId' in the dependency array ---
  }, [trainerId]);

  // --- Handle Session Booking ---
  const handleBookSession = async () => {
    if (!trainer || !scheduleSubject) {
        Alert.alert("Missing Information", "Please provide a subject for the session.");
        return;
    }
    setIsBooking(true);
    try {
      // Your create schedule API call is correct, but ensure you've defined this function in your api.ts
      // For now, let's use apiClient directly for consistency
      await apiClient.post('/v0/api/schedule/create', {
        trainerId: trainer._id,
        sessionDateTime: sessionDateTime.toISOString(),
        scheduleSubject,
        affectedArea,
      });
      
      setIsBooking(false);
      setModalVisible(false);
      Alert.alert("Success", "Your session request has been sent!", [{ text: "OK", onPress: () => router.back() }]);
    } catch (error) {
      console.error("Failed to book session:", error);
      setIsBooking(false);
      Alert.alert("Error", "Could not book the session. Please try again.");
    }
  };

  const onDateTimeChange = (event: any, selectedDate?: Date) => {
    setShowPicker(Platform.OS === 'ios' && event.type !== 'dismissed');
    if (selectedDate) {
        setSessionDateTime(selectedDate);
    }
  };

  // --- RENDER LOGIC ---
  if (loading) {
    return <ThemedView style={styles.centered}><ActivityIndicator size="large" color="#4CAF50" /></ThemedView>;
  }

  // NOTE: This check has been moved from the top of the component to here.
  if (!trainer) {
    return (
        <ThemedView style={styles.centered}>
            <Text style={{ color: 'white', fontSize: 18 }}>Trainer not found.</Text>
            <Button title="Go Back" onPress={() => router.back()} />
        </ThemedView>
    );
  }

  return (
    <ThemedView style={styles.container}>
      {/* --- Booking Modal --- */}
      <Modal /* ... modal code remains the same ... */ >
        {/* ... */}
      </Modal>

      {/* --- Profile Content --- */}
      <Image 
        source={trainer.image ? { uri: trainer.image } : require('@/assets/images/default-profile.png')} 
        style={styles.profileImage}
      />
      <Text style={styles.name}>{trainer.fullName}</Text>
      <Text style={styles.email}>{trainer.email}</Text>
      
      <TouchableOpacity style={styles.bookButton} onPress={() => setModalVisible(true)}>
        <Text style={styles.bookButtonText}>Book a Session</Text>
      </TouchableOpacity>
    </ThemedView>
  );
}
// --- FULL STYLESHEET ---
const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', padding: 20, backgroundColor: '#070F2B' },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  profileImage: { width: 150, height: 150, borderRadius: 75, marginBottom: 20, marginTop: 40 },
  name: { fontSize: 28, fontWeight: 'bold', color: '#fff', marginBottom: 5 },
  email: { fontSize: 16, color: 'gray', marginBottom: 40 },
  bookButton: { backgroundColor: '#4CAF50', paddingVertical: 15, paddingHorizontal: 30, borderRadius: 10 },
  bookButtonText: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
  },
  modalView: {
    width: '90%',
    backgroundColor: '#1A202C',
    borderRadius: 20,
    padding: 20,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 20,
  },
  input: {
    width: '100%',
    backgroundColor: '#2D3748',
    color: 'white',
    borderRadius: 8,
    padding: 15,
    marginBottom: 15,
    fontSize: 16,
  },
  datePickerButton: {
    width: '100%',
    backgroundColor: '#2D3748',
    borderRadius: 8,
    padding: 15,
    marginBottom: 15,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  datePickerText: {
    color: 'white',
    marginLeft: 10,
    fontSize: 16,
  },
  button: {
    backgroundColor: '#4CAF50',
    borderRadius: 10,
    paddingVertical: 15,
    elevation: 2,
    marginTop: 10,
    width: '100%',
    alignItems: 'center',
  },
  buttonDisabled: {
    backgroundColor: '#A5D6A7',
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
    fontSize: 16,
  },
});

