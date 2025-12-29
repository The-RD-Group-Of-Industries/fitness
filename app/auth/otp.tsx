import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, TextInput, TouchableOpacity } from "react-native";
import { Stack, useRouter, useLocalSearchParams } from "expo-router";
import { sendingMail } from "@/lib/api"; 
import { SafeAreaView } from "react-native-safe-area-context"; // Correct library
import { Ionicons } from '@expo/vector-icons';

export default function OTPSCREEN() {
  const router = useRouter();
  const { email } = useLocalSearchParams<{ email: string }>();

  const [otpValue, setOtpValue] = useState<string>("");
  const [generatedOtp, setGeneratedOtp] = useState<number | undefined>(undefined);
  const [loading, setLoading] = useState(false);

  // Generate OTP logic
  async function GenOtp() {
    try {
      const min = 10000;
      const max = 99999;
      const otp = Math.floor(Math.random() * (max - min + 1)) + min;

      const res = await sendingMail({
        email,
        otp,
      });

      if (res.status === 200) {
        return otp;
      } else {
        alert("Failed to send OTP. Please try again.");
        return undefined;
      }
    } catch (error) {
      alert("Something went wrong while sending OTP.");
      return undefined;
    }
  }

  async function VerifyOTP() {
    const inp = Number(otpValue.trim());

    if (!generatedOtp) {
      alert("OTP not generated. Please try again.");
      return;
    }

    if (!otpValue) {
      alert("Please enter the OTP.");
      return;
    }

    if (isNaN(inp)) {
      alert("OTP must be a number.");
      return;
    }

    if (inp === generatedOtp) {
      router.push({
        pathname: "/auth/recover",
        params: { email },
      });
    } else {
      alert("Invalid OTP, please check again.");
    }
  }

  useEffect(() => {
    const fetchOtp = async () => {
      const otp = await GenOtp();
      if (otp !== undefined) {
        setGeneratedOtp(otp);
      }
    };
    fetchOtp();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />

      {/* Header View: Ensures the back button stays within safe boundaries */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton} 
          onPress={() => router.back()}
        >
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
      </View>

      <View style={styles.content}>
        <Text style={styles.title}>Recover Your Account</Text>

        <Text
          style={[
            styles.label,
            { color: "#382eff", marginBottom: 32, textAlign: "center" },
          ]}
        >
          OTP has been sent successfully to {email},{"\n"}
          <Text style={{ color: "#ff5e5e" }}>
            Don't Forget to Check Spam Folder also.
          </Text>
        </Text>

        <View style={styles.form}>
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="Enter the OTP"
              placeholderTextColor="#6B7280"
              value={otpValue}
              onChangeText={setOtpValue}
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
            <Text style={styles.buttonText}>
              {loading ? "Verifying..." : "Verify"}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: "#090E21" 
  },
  header: {
    width: '100%',
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 10,
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#1C2139", // Matches theme
    justifyContent: "center",
    alignItems: "center",
  },
  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
    // Slight negative margin to compensate for header height and center form better
    marginTop: -64, 
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    color: "#fff",
    marginBottom: 8,
    textAlign: "center",
  },
  form: { 
    width: "100%", 
    maxWidth: 400 
  },
  inputContainer: { 
    marginBottom: 20 
  },
  label: { 
    color: "#fff", 
    fontSize: 16 
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
  },
  buttonDisabled: { 
    opacity: 0.7 
  },
  buttonText: { 
    color: "#fff", 
    fontSize: 18, 
    fontWeight: "600" 
  },
});
