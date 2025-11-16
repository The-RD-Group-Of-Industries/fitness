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
    Platform,
    KeyboardAvoidingView // Import KeyboardAvoidingView
} from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { ThemedView } from '@/components/ThemedView';
import apiClient from '@/lib/api'; 
import DateTimePicker from '@react-native-community/datetimepicker';
import { Ionicons } from '@expo/vector-icons';

// Define the interface for the Trainer object
interface Trainer {
  _id: string;
  fullName: string;
  email: string;
  image?: string;
}

export default function TrainerProfileScreen() {
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
    if (!trainerId) {
      setLoading(false);
      return;
    }
    const fetchTrainer = async () => {
      try {
        setLoading(true);
        const response = await apiClient.get(`/v0/api/user/trainers/${trainerId}`);
        if (response.data) {
            setTrainer(response.data);
        } else {
            setTrainer(null);
        }
      } catch (error) {
        console.error("Failed to fetch trainer details:", error);
        setTrainer(null);
      } finally {
        setLoading(false);
      }
    };
    fetchTrainer();
  }, [trainerId]);

  // --- Handle Session Booking ---
  const handleBookSession = async () => {
    if (!trainer || !scheduleSubject) {
        Alert.alert("Missing Information", "Please provide a subject for the session.");
        return;
    }
    setIsBooking(true);
    try {
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

  // --- Handle Date/Time Picker Changes ---
  const onDateTimeChange = (event: any, selectedDate?: Date) => {
    if (Platform.OS === 'android') {
        setShowPicker(false);
    }
    if (selectedDate) {
        setSessionDateTime(selectedDate);
    }
  };

  // --- RENDER LOGIC ---

  if (loading) {
    return (
        <ThemedView style={styles.centered}>
            <ActivityIndicator size="large" color="#4CAF50" />
            <Text style={styles.loadingText}>Loading Trainer...</Text>
        </ThemedView>
    );
  }

  if (!trainer) {
    return (
        <ThemedView style={styles.centered}>
            <Ionicons name="alert-circle-outline" size={48} color="red" />
            <Text style={styles.notFoundText}>Trainer Not Found</Text>
            <Button title="Go Back" onPress={() => router.back()} color="#E53E3E" />
        </ThemedView>
    );
  }

  return (
    <ThemedView style={styles.container}>
      {/* --- Booking Modal --- */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        {/* --- THIS IS THE FIX --- */}
        <KeyboardAvoidingView 
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={styles.modalContainer}
        >
          <View style={styles.modalView}>
            <Text style={styles.modalTitle}>Request a Session</Text>
            
            <TextInput style={styles.input} placeholder="Session Subject (e.g., Leg Day)" placeholderTextColor="#A0AEC0" value={scheduleSubject} onChangeText={setScheduleSubject} />
            <TextInput style={styles.input} placeholder="Affected Area (e.g., Knee Pain)" placeholderTextColor="#A0AEC0" value={affectedArea} onChangeText={setAffectedArea} />

            {Platform.OS === 'android' && (
                <TouchableOpacity style={styles.datePickerButton} onPress={() => setShowPicker(true)}>
                    <Ionicons name="calendar" size={20} color="#fff" />
                    <Text style={styles.datePickerText}>{sessionDateTime.toLocaleString()}</Text>
                </TouchableOpacity>
            )}

            {(showPicker || Platform.OS === 'ios') && (
              <DateTimePicker value={sessionDateTime} mode="datetime" display="spinner" onChange={onDateTimeChange} minimumDate={new Date()} textColor="white" />
            )}
            
            <TouchableOpacity style={[styles.button, isBooking && styles.buttonDisabled]} onPress={handleBookSession} disabled={isBooking}>
              <Text style={styles.buttonText}>{isBooking ? "Requesting..." : "Confirm Request"}</Text>
            </TouchableOpacity>
            <View style={{marginTop: 10}}>
                <Button title="Cancel" onPress={() => setModalVisible(false)} color="#E53E3E" />
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>

      {/* --- Trainer Profile Content --- */}
      <Image source={trainer.image ? { uri: trainer.image } : require('@/assets/images/default-profile.png')} style={styles.profileImage} />
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
  loadingText: { color: 'white', marginTop: 10 },
  notFoundText: { color: 'white', fontSize: 18, marginTop: 10, marginBottom: 20 },
  profileImage: { width: 150, height: 150, borderRadius: 75, marginBottom: 20, marginTop: 40, borderWidth: 3, borderColor: '#4CAF50' },
  name: { fontSize: 28, fontWeight: 'bold', color: '#fff', marginBottom: 5 },
  email: { fontSize: 16, color: 'gray', marginBottom: 40 },
  bookButton: { backgroundColor: '#4CAF50', paddingVertical: 15, paddingHorizontal: 30, borderRadius: 10 },
  bookButtonText: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
  // --- UPDATED MODAL STYLES ---
  modalContainer: {
    flex: 1,
    justifyContent: 'center', // This now centers the content perfectly
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
  modalTitle: { fontSize: 22, fontWeight: 'bold', color: 'white', marginBottom: 20 },
  input: { width: '100%', backgroundColor: '#2D3748', color: 'white', borderRadius: 8, padding: 15, marginBottom: 15, fontSize: 16 },
  datePickerButton: { width: '100%', backgroundColor: '#2D3748', borderRadius: 8, padding: 15, marginBottom: 15, flexDirection: 'row', alignItems: 'center', justifyContent: 'center' },
  datePickerText: { color: 'white', marginLeft: 10, fontSize: 16 },
  button: { backgroundColor: '#4CAF50', borderRadius: 10, paddingVertical: 15, elevation: 2, marginTop: 10, width: '100%', alignItems: 'center' },
  buttonDisabled: { backgroundColor: '#A5D6A7' },
  buttonText: { color: 'white', fontWeight: 'bold', textAlign: 'center', fontSize: 16 },
});

