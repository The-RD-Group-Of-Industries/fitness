import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { ThemedView } from '@/components/ThemedView'; // Assuming you have this
import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import {createTrainer} from '@/lib/api';

export default function CreateTrainerScreen() {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const role = 'Trainer'

  const handleCreateTrainer = async () => {
    if (!fullName || !email || !password) {
      Alert.alert('Missing Information', 'Please fill out all fields.');
      return;
    }
    
    setLoading(true);
    try {
      const response = await createTrainer({
        fullName,
        email,
        password,
      });

      if (response.status === 201) {
        Alert.alert('Success', `Trainer account for ${fullName} has been created.`);
        router.back(); // Go back to the dashboard after success
      }
    } catch (error:any) {
      const errorMessage = error.response?.data?.message || 'An unexpected error occurred.';
      console.error('Failed to create trainer:', errorMessage);
      console.log("error in create-trainer",error);
      Alert.alert('Creation Failed', errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ThemedView style={styles.container}>
      <Text style={styles.title}>New Trainer Details</Text>
      
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Full Name"
          placeholderTextColor="#a9a9a9"
          value={fullName}
          onChangeText={setFullName}
        />
        <TextInput
          style={styles.input}
          placeholder="Email Address"
          placeholderTextColor="#a9a9a9"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />
        <TextInput
          style={styles.input}
          placeholder="Password"
          placeholderTextColor="#a9a9a9"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />
                <View style={styles.roleDisplay}>
          <Text style={styles.roleLabel}>Role:</Text>
          <Text style={styles.roleValue}>{role}</Text>
        </View>

      </View>

      <TouchableOpacity onPress={handleCreateTrainer} disabled={loading}>
        <LinearGradient
          colors={loading ? ['#a9a9a9', '#808080'] : ['#4CAF50', '#2E7D32']}
          style={styles.button}
        >
          {loading ? (
            <ActivityIndicator color="#ffffff" />
          ) : (
            <Text style={styles.buttonText}>Create Trainer Account</Text>
          )}
        </LinearGradient>
      </TouchableOpacity>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#070F2B',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 30,
  },
  inputContainer: {
    marginBottom: 20,
  },
  input: {
    backgroundColor: '#0c1742',
    color: '#ffffff',
    height: 50,
    borderRadius: 10,
    paddingHorizontal: 15,
    fontSize: 16,
    marginBottom: 15,
  },
  roleDisplay: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#0c1742',
    height: 50,
    borderRadius: 10,
    paddingHorizontal: 15,
  },
  roleLabel: {
    fontSize: 16,
    color: '#a9a9a9',
    marginRight: 10,
  },
  roleValue: {
    fontSize: 16,
    color: '#ffffff',
    fontWeight: 'bold',
  },
  button: {
    height: 50,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
