import { View, Text, StyleSheet, TextInput, TouchableOpacity } from "react-native"
import { useState } from "react"
import { Stack, useRouter, useLocalSearchParams } from "expo-router"
import axios from "axios"

export default function OTPSCREEN() {
  const router = useRouter()
  const {email} = useLocalSearchParams<{email: string}>()
  const [Password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)

  const ChangePassword = async () => {
    try {
      setLoading(true)
      const check = await axios.post("https://fitness-admin-tau.vercel.app/api/mobile/auth/changepass", {
        email: email,
        password: Password
      })
      console.log(check.status)
      console.log(check.data)
      if (check.status === 200) {
        if (check.data.status === "success") {
          alert("Password Changed Successfully!")
          router.push({
            pathname: "/auth/login"
          })
        }
    }
  }
    catch (e) {
      alert("Something went wrong, Please try again later!")
    }
    finally {
      setLoading(false)
    }
}
  return (

    <View style={styles.container}>
    <Stack.Screen 
      options={{
        headerShown: false,
      }}
      />
      <View style={styles.content}>
        <Text style={styles.title}>Recover Your Account</Text>
        <View style={styles.form}>
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Password</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter your new password"
              placeholderTextColor="#6B7280"
              value={Password}
              onChangeText={setPassword}
              autoCapitalize="none"
              keyboardType="default"
            />
          </View>

          <TouchableOpacity
            style={[styles.button, loading && styles.buttonDisabled]}
            disabled={loading}
            onPress={ChangePassword}
          >
            <Text style={styles.buttonText}>{loading ? "Verifing..." : "Change Password"}</Text>
          </TouchableOpacity>
        </View>
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
  title: {
    fontSize: 24,
    fontWeight: "700",
    color: "#fff",
    marginBottom: 4,
    textAlign: "center",
  },
  form: {
    width: "100%",
    maxWidth: 400,
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    color: "#fff",
    marginBottom: 8,
    fontSize: 16,
  },
  input: {
    backgroundColor: "#1C2139",
    borderRadius: 12,
    padding: 16,
    color: "#fff",
    fontSize: 16,
  },
  optionsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 24,
  },
  forgotPassword: {
    color: "#382eff",
  },
  button: {
    backgroundColor: "#382eff",
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
  },
  signupContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 24,
  },
  signupText: {
    color: "#9BA1A6",
    marginRight: 4,
  },
  signupLink: {
    color: "#382eff",
  },
})