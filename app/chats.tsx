import React, { useState, useEffect } from "react"
import { View, Text, StyleSheet, TextInput, FlatList, TouchableOpacity, ActivityIndicator } from "react-native"
import { Stack } from "expo-router"
import axios from "axios"
import AsyncStorage from "@react-native-async-storage/async-storage"
import { useThemeColor } from "@/hooks/useThemeColor"
import { useRouter } from "expo-router"

interface Trainer {
  id: string
  name: string | null
  email: string
  image?: string
  specialization?: string
}

export default function ChatsScreen() {
  const [trainers, setTrainers] = useState<Trainer[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [loading, setLoading] = useState(true)
  const color = useThemeColor({ light: "black", dark: "white" }, "text")
  const router = useRouter()

  useEffect(() => {
    fetchTrainers()
  }, [])

  const fetchTrainers = async () => {
    try {
      const token = await AsyncStorage.getItem("userToken")
      const response = await axios.get("https://fitness-evolution-kohl.vercel.app/api/mobile/users/trainer", {
        headers: { Authorization: `Bearer ${token}` },
      })
      setTrainers(response.data.users)
    } catch (error) {
      console.error("Error fetching trainers:", error)
    } finally {
      setLoading(false)
    }
  }

  const filteredTrainers = trainers.filter(
    (trainer) =>
      trainer.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      trainer.email.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const handleTrainerPress = (trainerId: string) => {
    router.push({
      pathname: "/chat/[trainerId]",
      params: { trainerId },
    })
  }

  const renderTrainerItem = ({ item }: { item: Trainer }) => (
    <TouchableOpacity style={styles.trainerItem} onPress={() => handleTrainerPress(item.id)}>
      <Text style={[styles.trainerName, { color }]}>{item.name || "Unnamed Trainer"}</Text>
      <Text style={styles.trainerEmail}>{item.email}</Text>
      {item.specialization && <Text style={styles.trainerSpecialization}>{item.specialization}</Text>}
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
    <>
      <Stack.Screen options={{ title: "Chats" }} />
      <View style={styles.container}>
        <TextInput
          style={styles.searchBar}
          placeholder="Search trainers..."
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholderTextColor="#6B7280"
        />
        <FlatList
          data={filteredTrainers}
          renderItem={renderTrainerItem}
          keyExtractor={(item) => item.id}
          style={styles.trainerList}
        />
      </View>
    </>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#090E21",
    padding: 16,
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