import { View, Text, StyleSheet, TextInput, TouchableOpacity } from "react-native"
import { useEffect, useState } from "react"
import { Stack, useRouter, useLocalSearchParams } from "expo-router"
import axios from "axios"
import { useAuth } from "@/context/AuthContext"


export default function OTPSCREEN() {
  const router = useRouter()
  const { register } = useAuth()
  const {email, registerd, password, name} = useLocalSearchParams<{email: string, registerd: string, name: string, password: string}>()
  const [Value, setNumber] = useState(0)
  const [generated, setGenerated] = useState<u | number>(0)
  const [loading, setLoading] = useState(false)

  async function GenOtp() {
    let minm = 10000;
    let maxm = 99999;
    let number =  Math.floor(Math.random() * (maxm - minm + 1)) + minm;
    const sendMail = await axios.post("https://fitness-admin-tau.vercel.app/api/mobile/auth/sendotp", { 
      email: email,
      otp: number,
    })
    if (sendMail.status === 200) {
      console.log(number)
      return number
    }
  }

  async function VerifyOTP() {
    const inp = Number(Value)
    
    if (inp === generated) {
      if (registerd === "true") {
            return await register(name, email, password);
      }
      else {
        router.push({
          pathname: "/auth/recover",
          params: { email: email }
        })
      }
    }
    else {
      console.log(inp, generated)
      alert("Invalid OTP, Please check again.")
    }
  }


  useEffect(() => {
    const fetchOtp = async () => {
      const gen = await GenOtp();
      setGenerated(gen);
    };
  
    fetchOtp();
  }, []);
  return (

    <View style={styles.container}>
    <Stack.Screen 
      options={{
        headerShown: false,
      }}
      />
      <View style={styles.content}>
        <Text style={styles.title}>Recover Your Account</Text>
      <Text style={[styles.label, {color: '#382eff', marginBottom: 32, textAlign: "center"}]}>OTP has been sent successfully to {email}, {"\n"}<Text style={{color: "#ff5e5e"}}>Don't Forget to Check Spam Folder also.</Text></Text>
        <View style={styles.form}>
          <View style={styles.inputContainer}>
            {/* <Text style={styles.label}>OTP</Text> */}
            <TextInput
              style={styles.input}
              placeholder="Enter the OTP"
              placeholderTextColor="#6B7280"
              value={Value}
              onChangeText={setNumber}
              autoCapitalize="none"
              maxLength={5}
              keyboardType="number-pad"
            />
          </View>

          <TouchableOpacity
            style={[styles.button, loading && styles.buttonDisabled]}
            onPress={VerifyOTP}
            disabled={loading}
          >
            <Text style={styles.buttonText}>{loading ? "Verifing..." : "Verify"}</Text>
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