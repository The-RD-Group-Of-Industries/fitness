import { View, Text, StyleSheet, ScrollView, Image, ActivityIndicator } from "react-native"
import { useState, useEffect } from "react"
import axios from "axios"
import React from "react"
import { useThemeColor } from "@/hooks/useThemeColor"

interface Trainer {
  id: string
  name: string
  image?: string
  email: string
  specialization?: string // Added specialization field
}

export default function Trainer() {
  const [trainers, setTrainers] = useState<Trainer[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const color = "white"

  useEffect(() => {
    const fetchTrainers = async () => {
      try {
        setLoading(true)
        setError(null)
        const response = await axios.get<{ users: Trainer[] }>("https://fitness-admin-tau.vercel.app/api/mobile/users/trainer", {
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
        })
        setTrainers(response.data.users)
      } catch (error) {
        console.error("Error fetching trainers:", error)
        setError("Failed to load trainers. Please try again later.")
      } finally {
        setLoading(false)
      }
    }

    fetchTrainers()
  }, [])

  if (loading) {
    return (
      <View style={style.centered}>
        <ActivityIndicator size="large" color={color} />
      </View>
    )
  }

  if (error) {
    return (
      <View style={style.centered}>
        <Text style={[style.errorText, { color }]}>{error}</Text>
      </View>
    )
  }

  return (
    <View style={style.main}>
      <Text style={[style.heading, { color }]}>Featured Trainer</Text>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ flex: 1 }}>
        {trainers.map((trainer, idx) => (
          <View style={style.box} key={trainer.id || idx}>
            <View style={style.image}>
              <Image
                alt="avatar"
                source={trainer.image ? { uri: trainer.image } : require("@/assets/images/pfp.jpg")}
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                }}
                width={1080}
                height={1080}
              />
            </View>
            <Text style={style.title}>{trainer.name}</Text>
            {trainer.specialization && <Text style={style.subHeading}>{trainer.specialization}</Text>}
          </View>
        ))}
      </ScrollView>
    </View>
  )
}

const style = StyleSheet.create({
  main: {
    paddingHorizontal: 12,
  },
  heading: {
    fontSize: 28,
    fontWeight: "800",
    paddingVertical: 10,
  },
  box: {
    width: 200,
    height: 250,
    marginLeft: 10,
  },
  image: {
    width: "100%",
    height: "75%", // Reduced height to accommodate specialization text
    borderRadius: 14,
    overflow: "hidden",
  },
  title: {
    color: "white",
    fontSize: 22,
    fontWeight: "800",
    marginTop: 2,
  },
  subHeading: {
    fontSize: 14,
    color: "#9BA1A6", // Using a muted color for specialization
    marginTop: 2,
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  errorText: {
    fontSize: 16,
    textAlign: "center",
  },
})