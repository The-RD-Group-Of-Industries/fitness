import { View, Text, StyleSheet, TextInput, TouchableOpacity } from "react-native"
import { useState } from "react"
import { Stack, useRouter } from "expo-router"
import { FontAwesome6 } from "@expo/vector-icons"
import { useAuth } from "@/context/AuthContext"
import Feather from '@expo/vector-icons/Feather';

export default function LoginScreen() {
  const router = useRouter()
  const { login } = useAuth()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [rememberMe, setRememberMe] = useState(false)
  const [loading, setLoading] = useState(false)
  const [view, setView] = useState(false)

  const handleLogin = async () => {
    try {
      setLoading(true)
      await login(email, password)
    } catch (error) {
      alert("Something went wrong, Please check your credentials")
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

        <Text style={styles.title}>Welcome to Fitness Evolution</Text>

        <View style={styles.form}>
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

          <View style={styles.optionsContainer}>
            <TouchableOpacity style={styles.checkboxContainer} onPress={() => setRememberMe(!rememberMe)}>
              <View style={[styles.checkbox, rememberMe && styles.checkboxChecked]}>
                {rememberMe && <FontAwesome6 name="check" size={12} color="#fff" />}
              </View>
              <Text style={styles.checkboxLabel}>Remember me</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => router.push("/auth/forget")}>
              <Text style={styles.forgotPassword}>Forgot password?</Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            style={[styles.button, loading && styles.buttonDisabled]}
            onPress={handleLogin}
            disabled={loading}
          >
            <Text style={styles.buttonText}>{loading ? "Logging in..." : "Login"}</Text>
          </TouchableOpacity>

          <View style={styles.signupContainer}>
            <Text style={styles.signupText}>New to Fitness Evolution?</Text>
            <TouchableOpacity onPress={() => router.push("/auth/register")}>
              <Text style={styles.signupLink}>Create an account</Text>
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
  btn: {
    backgroundColor: "#1C2139",
    borderRadius: 12,
    padding: 16,
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
  inputContainer_sec: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
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
  input_sec: {
    width: "80%"
  },
  optionsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 24,
  },
  checkboxContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: "#382eff",
    marginRight: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  checkboxChecked: {
    backgroundColor: "#382eff",
  },
  checkboxLabel: {
    color: "#fff",
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