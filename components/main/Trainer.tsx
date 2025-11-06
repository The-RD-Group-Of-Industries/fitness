import { View, Text, StyleSheet, ScrollView, Image, ActivityIndicator, RefreshControl, FlatList } from "react-native"
import { useState, useEffect, useCallback } from "react"
import axios from "axios"
import React from "react"
import { useThemeColor } from "@/hooks/useThemeColor"

interface Trainer {
  id: string
  name: string
  image?: string
  email: string
  specialization?: string
  rating?: number | null
}

export default function Trainer() {
  const [trainers, setTrainers] = useState<Trainer[]>([])
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const color = "white"

  const fetchTrainers = useCallback(async (isRefreshing = false) => {
    try {
      if (!isRefreshing) {
        setLoading(true)
      }
      setError(null)
    
      
      const response = await axios.get("http://localhost:3000", {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        timeout: 10000, // 10 second timeout
      })

      
      if (response.data && response.data.users && Array.isArray(response.data.users)) {
        
        setTrainers([...response.data.users]) // Force new array reference
      } else {
        
        setTrainers([])
        setError("Invalid data format received")
      }
    } catch (error) {
      
      setError("Failed to load trainers. Please try again later.")
      setTrainers([]) // Clear trainers on error
    } finally {
      setLoading(false)
      if (isRefreshing) {
        setRefreshing(false)
      }
    }
  }, [])

  useEffect(() => {
    fetchTrainers()
  }, [fetchTrainers])


  // Debug logging
  useEffect(() => {
    
    
    if(trainers) {
      
    }
  }, [trainers])

  if (loading && !refreshing) {
    return (
      <View style={style.centered}>
        <ActivityIndicator size="large" color={color} />
        <Text style={[style.loadingText, { color }]}>Loading trainers...</Text>
      </View>
    )
  }

  if (error && trainers.length === 0) {
    return (
      <View style={style.centered}>
        <Text style={[style.errorText, { color }]}>{error}</Text>
        <Text 
          style={[style.retryText, { color: "#00B4D8" }]} 
          onPress={() => fetchTrainers()}
        >
          Tap to retry
        </Text>
      </View>
    )
  }

  return (
    <View style={style.main}>
      <Text style={[style.heading, { color }]}>Featured Trainer</Text>
      {
        trainers.length > 0 ? (
          <FlatList 
          horizontal
          showsHorizontalScrollIndicator={false}
          data={trainers}
          keyExtractor={(item) => item.id}
          renderItem={(trainer) => (
                      <View style={style.box} key={`${trainer.item.id}-${trainer.index}`}>
                <View style={style.image}>
                <Image 
                    source={trainer.item.image ? { uri: trainer.item.image } : require("@/assets/images/pfp.jpg")}
                    style={style.imageStyle}
                    resizeMode="cover"
                    onError={(error) => {
                      
                    }}
                    onLoad={() => {
                      
                    }}
                  />
                </View>
                <Text style={style.title} numberOfLines={2}>{trainer.item.name}</Text>
                {trainer.item.specialization ? (
                  <Text style={style.subHeading} numberOfLines={2}>
                    {trainer.item.specialization.trim()}
                  </Text>
                ) : null}
                {trainer.item.rating && (
                  <Text style={style.rating}>⭐ {trainer.item.rating}</Text>
                )}
              </View>
          )}
          /> 
        ) : (
          <Text style={{color: 'white'}}>NO Data Found</Text>
        )
      }
    </View>
  )
}

const style = StyleSheet.create({
  main: {
    paddingHorizontal: 10,
  },
  heading: {
    fontSize: 28,
    fontWeight: "800",
    paddingVertical: 10,
  },
  box: {
    width: 200,
    height: 280, // Increased height for rating
    marginRight: 15, // Changed from marginLeft to marginRight for better spacing
  },
  image: {
    width: "100%",
    height: "80%", // Adjusted for additional content
    borderRadius: 14,
    overflow: "hidden",
    backgroundColor: "#1C2139", // Fallback background
  },
  imageStyle: {
    width: "100%", 
    height: "100%", 
    borderRadius: 14,
  },
  title: {
    color: "white",
    fontSize: 20, // Slightly smaller for better fit
    fontWeight: "800",
    marginTop: 8,
    lineHeight: 24,
  },
  subHeading: {
    fontSize: 14,
    color: "#9BA1A6",
    marginTop: 2,
    lineHeight: 18,
  },
  rating: {
    fontSize: 12,
    color: "#FFD700",
    marginTop: 2,
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  errorText: {
    fontSize: 16,
    textAlign: "center",
    marginBottom: 10,
  },
  loadingText: {
    fontSize: 14,
    marginTop: 10,
    textAlign: "center",
  },
  retryText: {
    fontSize: 16,
    textAlign: "center",
    textDecorationLine: "underline",
    fontWeight: "600",
  },
  noDataContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 40,
  },
  noDataText: {
    fontSize: 16,
    textAlign: "center",
    marginBottom: 10,
  },
})