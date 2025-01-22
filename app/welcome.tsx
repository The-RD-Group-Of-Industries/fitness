import { View, Text, StyleSheet, TouchableOpacity } from "react-native"
import { useRouter } from "expo-router"
import { LinearGradient } from "expo-linear-gradient"
import { FontAwesome6 } from "@expo/vector-icons"
import { useAuth } from "@/context/AuthContext"

export default function WelcomeScreen() {
  const router = useRouter()
  const { isAuthenticated } = useAuth()

  const handleGetStarted = () => {
    if (isAuthenticated) {
      router.replace("/(tabs)")
    } else {
      router.push("/auth/login")
    }
  }

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <View style={styles.iconContainer}>
          <FontAwesome6 name="dumbbell" size={40} color="#fff" />
        </View>

        <View style={styles.textContainer}>
          <Text style={styles.title}>Fitness Evolution</Text>
          <Text style={styles.subtitle}>Transform Your Life</Text>
        </View>

        <LinearGradient
          colors={["#08027a", "#382eff"]}
          start={{ x: 1, y: 0.9 }}
          end={{ x: 0.3, y: 0.8 }}
          style={styles.button}
        >
          <TouchableOpacity onPress={handleGetStarted}>
            <Text style={styles.buttonText}>Get Started</Text>
          </TouchableOpacity>
        </LinearGradient>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#090E21",
  },
  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#2A2E43",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 24,
  },
  textContainer: {
    alignItems: "center",
    marginBottom: 40,
  },
  title: {
    fontSize: 32,
    fontWeight: "700",
    color: "#fff",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 18,
    color: "#9BA1A6",
  },
  button: {
    width: "100%",
    paddingVertical: 16,
    borderRadius: 12,
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
    textAlign: "center",
  },
})