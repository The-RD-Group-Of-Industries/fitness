import React, { useState, useEffect } from "react"
import { View, Text, StyleSheet, TextInput, FlatList, TouchableOpacity, ActivityIndicator, Platform, StatusBar } from "react-native"
import { Stack } from "expo-router"
import axios from "axios"
import AsyncStorage from "@react-native-async-storage/async-storage"
import { useThemeColor } from "@/hooks/useThemeColor"
import { useRouter } from "expo-router"
import { SafeAreaView } from "react-native"
import { ThemedView } from "@/components/ThemedView"

interface Trainer {
  id: string
  name: string | null
  email: string
  image?: string
  specialization?: string
}

export default function ChatsScreen() {
  const [trainers, setTrainers] = useState<Trainer[]>([])
  const [AssignedTrnr, setAssignedTrnr] = useState<any>({})
  const [searchQuery, setSearchQuery] = useState("")
  const [loading, setLoading] = useState(true)
  const color = "white"
  const router = useRouter()



  const fetchAdmins = async () => {
    try {
      const token = await AsyncStorage.getItem("userToken")
      const response = await axios.get("https://fitness-admin-tau.vercel.app/api/mobile/users/admin", {
        headers: { Authorization: `Bearer ${token}` },
      })
      setTrainers(response.data.users)
    } catch (error) {
      console.error("Error fetching trainers:", error)
    } finally {
      setLoading(false)
    }
  }

  const fetchTrainers = async (): Promise<void> => {
    try {
      const token = await AsyncStorage.getItem("userToken");
      const response = await axios.get(
        "https://fitness-admin-tau.vercel.app/api/mobile/users/usrTrainr", 
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setAssignedTrnr(response.data.user.trainer)
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };



  const filteredTrainers = trainers.filter(
    (trainer) =>
      trainer.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      trainer.email.toLowerCase().includes(searchQuery.toLowerCase()),
  )


  useEffect(() => {
    fetchAdmins()
    fetchTrainers()
  }, [])

  const handleTrainerPress = (trainerId: string, name: string) => {
    router.push({
      pathname: "/chat/[trainerId]",
      params: { trainerId, name },
    })
  }

  const renderTrainerItem = ({ item }: { item: Trainer }) => (
    <TouchableOpacity style={styles.trainerItem} onPress={() => handleTrainerPress(item.id, item.name ? item.name : "Admin")}>
      <Text style={[styles.trainerName, { color }]}>{item.name || "Admin"}</Text>
      <Text style={styles.trainerEmail}>{item.email}</Text>
      {/* {item.specialization && <Text style={styles.trainerSpecialization}>{item.specialization}</Text>} */}
    </TouchableOpacity>
  )

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#382eff" />
      </View>
    )
  }

  return (
    <ThemedView>
      <Stack.Screen options={{ title: "Chats", 
      headerBackButtonDisplayMode: "minimal",
      headerStyle: {
        backgroundColor: "#090E26",
      }, headerTintColor: "#fff", headerTitleStyle: {
        fontWeight: "600",
      } }} />
      <View style={styles.container}>
        <TextInput
          style={styles.searchBar}
          placeholder="Search Admins..."
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholderTextColor="#6B7280"
        />
        {
          AssignedTrnr && 
          <>
          <Text style={{
            fontSize: 24,
            color: 'white',
            paddingHorizontal: 6,
            paddingVertical: 10,
            fontWeight: 800
          }}>Trainer</Text>
          <FlatList
          data={AssignedTrnr}
          renderItem={renderTrainerItem}
          keyExtractor={(item) => item.id}
          style={styles.trainerList}
          />
          </>
        }
        <Text style={{
          fontSize: 24,
          color: 'white',
          paddingHorizontal: 6,
          paddingVertical: 10,
          fontWeight: 800
        }}>Admins</Text>
        <FlatList
          data={filteredTrainers}
          renderItem={renderTrainerItem}
          keyExtractor={(item) => item.id}
          style={styles.trainerList}
        />
      </View>
    </ThemedView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#090E21",
    padding: 16,
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#090E21",
  },
  searchBar: {
    backgroundColor: "#1C2139",
    borderRadius: 12,
    padding: 12,
    marginBottom: 16,
    color: "#fff",
    fontSize: 16,
  },
  trainerList: {
    flex: 1,
  },
  trainerItem: {
    backgroundColor: "#1C2139",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    color: "white"
  },
  trainerName: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 4,
  },
  trainerEmail: {
    color: "#9BA1A6",
    fontSize: 14,
  },
  trainerSpecialization: {
    color: "#6B7280",
    fontSize: 14,
    marginTop: 4,
  },
})