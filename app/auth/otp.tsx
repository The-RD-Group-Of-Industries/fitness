import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, TextInput, TouchableOpacity } from "react-native";
import { Stack, useRouter, useLocalSearchParams } from "expo-router";
import { sendingMail } from "@/lib/api"; 

export default function OTPSCREEN() {
  const router = useRouter();
  const { email } = useLocalSearchParams<{ email: string }>();

  const [otpValue, setOtpValue] = useState<string>("");
  const [generatedOtp, setGeneratedOtp] = useState<number | undefined>(undefined);
  const [loading, setLoading] = useState(false);

  // Generate OTP on backend and store same value on client to verify
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
        console.log("OTP sent successfully:", otp);
        return otp;
      } else {
        console.log("Failed to send OTP:", res.status, res.data);
        alert("Failed to send OTP. Please try again.");
        return undefined;
      }
    } catch (error) {
      console.log("Error sending OTP:", error);
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
      // OTP correct → go to reset‑password screen
      router.push({
        pathname: "/auth/recover",
        params: { email },
      });
    } else {
      console.log("Entered / Generated:", inp, generatedOtp);
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
    <View style={styles.container}>
      <Stack.Screen
        options={{
          headerShown: false,
        }}
      />

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
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#090E21" },
  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    color: "#fff",
    marginBottom: 4,
    textAlign: "center",
  },
  form: { width: "100%", maxWidth: 400 },
  inputContainer: { marginBottom: 20 },
  label: { color: "#fff", marginBottom: 8, fontSize: 16 },
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
  buttonDisabled: { opacity: 0.7 },
  buttonText: { color: "#fff", fontSize: 18, fontWeight: "600" },
});
