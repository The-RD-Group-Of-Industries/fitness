import { View, Text, StyleSheet, TextInput, TouchableOpacity } from "react-native"
import { useState } from "react"
import { Stack, useRouter } from "expo-router"
import { Feather, FontAwesome6 } from "@expo/vector-icons"
import { useAuth } from "@/context/AuthContext"
import axios from "axios"
import { registerUser } from "@/lib/api"
import * as SecureStore from 'expo-secure-store';



export default function RegisterScreen() {
  const router = useRouter()
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [view, setView] = useState(false)


  const handleRegister = async () => {
    try {
      setLoading(true)

        const response = await registerUser({
        name: name,
        email: email,
        password: password,
      });

      // if (response.status === 201) {
      //    alert("user created Succesfully")
                // 1. Store the token (using your AuthContext or SecureStore)
        // await onLogin(response.data.token, response.data.user);
        if (response.data && response.data.token) {
        // Store the token securely
        await SecureStore.setItemAsync('token', response.data.token);
        alert('Success Registration successful!');

        router.replace('/(tabs)'); 
          
      }
} 
    catch (error) {
      console.error("Registration error:", error)
      // Handle error appropriately
    } finally {
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
        <View style={styles.iconContainer}>
          <FontAwesome6 name="dumbbell" size={40} color="#fff" />
        </View>

        <Text style={styles.title}>Create Account</Text>

        <View style={styles.form}>
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Name</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter your name"
              placeholderTextColor="#6B7280"
              value={name}
              onChangeText={setName}
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Email</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter your email"
              placeholderTextColor="#6B7280"
              value={email}
              onChangeText={setEmail}
              autoCapitalize="none"
              keyboardType="email-address"
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Password</Text>
            <View style={styles.inputContainer_sec}>
            <TextInput
              style={[styles.input, styles.input_sec]}
              placeholder="Enter your password"
              placeholderTextColor="#6B7280"
              value={password}
              onChangeText={setPassword}
              secureTextEntry={view ? false : true}
              />
        <TouchableOpacity style={styles.btn}>
              {view ? <Feather name="eye-off" size={24} color="white" onPress={() => setView(!view)}/> :
              <Feather name="eye" size={24} color="white" onPress={() => setView(!view)}/>}
        </TouchableOpacity>
              </View>
          </View>
          {/* <View style={styles.inputContainer}>
            <Text style={styles.label}>Password</Text>
            <TextInput
              style={styles.input}
              placeholder="Create a password"
              placeholderTextColor="#6B7280"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
            />
          </View> */}

          <TouchableOpacity
            style={[styles.button, loading && styles.buttonDisabled]}
            onPress={handleRegister}
            disabled={loading}
          >
            <Text style={styles.buttonText}>{loading ? "Creating account..." : "Create Account"}</Text>
          </TouchableOpacity>

          <View style={styles.loginContainer}>
            <Text style={styles.loginText}>Already have an account?</Text>
            <TouchableOpacity onPress={() => router.push("/auth/login")}>
              <Text style={styles.loginLink}>Login</Text>
            </TouchableOpacity>
          </View>
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
  btn: {
    backgroundColor: "#1C2139",
    borderRadius: 12,
    padding: 16,
  },
  input_sec: {
    width: "80%"
  },
  inputContainer_sec: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
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
    marginBottom: 32,
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
  button: {
    backgroundColor: "#382eff",
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 8,
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
  },
  loginContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 24,
  },
  loginText: {
    color: "#9BA1A6",
    marginRight: 4,
  },
  loginLink: {
    color: "#382eff",
  },
})

