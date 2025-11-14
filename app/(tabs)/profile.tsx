import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Dimensions,
  Platform,
  StatusBar,
  PixelRatio,
  ScrollView,
  Alert,
  TextInput,
  ActivityIndicator, // Ensure ActivityIndicator is imported
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { AntDesign, Feather, Ionicons, SimpleLineIcons } from "@expo/vector-icons";
import { ThemedView } from "@/components/ThemedView";
import { useAuth } from "@/context/AuthContext";
import { apiClient } from "@/lib/api"; // Import your configured apiClient

// --- Helper functions and constants (These are fine) ---
const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");
const baseWidth = 375;
const wp = (percentage: number): number => (percentage * SCREEN_WIDTH) / 100;
const hp = (percentage: number): number => (percentage * SCREEN_HEIGHT) / 100;
const normalize = (size: number): number => {
  const scale = SCREEN_WIDTH / baseWidth;
  const newSize = size * scale * 1.2;
  return Platform.OS === "ios"
    ? Math.round(PixelRatio.roundToNearestPixel(newSize))
    : Math.round(PixelRatio.roundToNearestPixel(newSize)) - 2;
};
const isTablet = (): boolean => (SCREEN_WIDTH < SCREEN_HEIGHT ? SCREEN_WIDTH : SCREEN_HEIGHT) >= 600;

interface OptionItem {
  title: string;
  Icon: any;
  iconName: string;
  iconColor: string;
}

// --- Main Component ---
const TabTwoScreen: React.FC = () => {
  // FIX 1: Get 'user' and 'logout' from the context *inside* the component.
  const { logout, user } = useAuth();
  
  const color = "white";
  const [changeNumber, setChangeNumber] = useState(false);
  // FIX 2: Initialize the phone state with the user's phone if it exists.
  const [phone, setPhone] = useState(user?.phone || "+91");

  // This useEffect for dimensions is fine.
  useEffect(() => {
    // ...
  }, []);

  // FIX 3: Update API functions to use the centralized apiClient.
  const deleteAccount = async () => {
    try {
      const req = await apiClient.delete("/api/mobile/user");
      if (req.status === 200) {
        logout(); // logout() already handles token clearing and redirection.
      }
    } catch (error) {
      console.error("Error deleting account:", error);
      Alert.alert("Error", "Failed to delete account.");
    }
  };

  const handleAddPhone = async () => {
    const value = phone.trim();
    if (value.length < 10) {
      Alert.alert("Invalid Phone Number", "Please enter a valid number.");
      return;
    }
    try {
      const req = await apiClient.put("/api/mobile/phone", { phone: value });
      if (req.status === 200) {
        Alert.alert("Success", "Phone number updated.");
        setChangeNumber(false);
        // Note: The user object in context won't auto-update. A fresh login is needed to see the change.
      }
    } catch (error) {
      console.error("Error updating phone:", error);
      Alert.alert("Error", "Failed to update phone number.");
    }
  };

  // Your alert functions and handleChange are fine.
  const askToDelete = () => Alert.alert("Delete Account", /*...*/);
  const askToLogout = logout;
  const handleChange = (value: string) => { /* ... */ };

  // FIX 4: Add a loading guard. This is the most important fix.
  // It prevents the component from crashing while the user data is being fetched.
  // if (!user) {
  //   return (
  //     <ThemedView style={styles.loadingContainer}>
  //       <ActivityIndicator size="large" color="#ffffff" />
  //     </ThemedView>
  //   );
  // }

  // --- Main Render Block ---
  return (
    <ThemedView>
      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        <View style={styles.container}>
          {/* Your 'changeNumber' modal is fine */}

          <View style={styles.childContainer}>
            <Text style={[styles.heading, { color }]}>My Account</Text>

            <View style={styles.cardPrimary}>
              <LinearGradient colors={["#704CC5", "#465EC2"]} style={styles.modCircle} start={{ x: 0.3, y: 1 }} end={{ y: 0, x: 0.3 }}>
                {user.image ? (
                  <Image source={{ uri: user.image }} style={styles.profileImage} />
                ) : (
                  <View style={styles.iconContainer}>
                    <Ionicons name="person" size={normalize(32)} color={color} />
                  </View>
                )}
              </LinearGradient>

              <View style={styles.boxText}>
                {/* FIX 5: Use the 'user' object directly from the context. */}
                <Text style={styles.name} numberOfLines={1}>{user.fullName}</Text>
                <Text style={styles.email} numberOfLines={1}>{user.email}</Text>
                
                <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
                  <Text style={[styles.email, styles.phone]} numberOfLines={1}>
                    {user.phone || "Add Phone No."}
                  </Text>
                  <TouchableOpacity style={{ marginTop: 4 }} onPress={() => setChangeNumber(true)}>
                    <Ionicons name="pencil" size={14} color="white" />
                  </TouchableOpacity>
                </View>
              </View>
            </View>

            <View style={styles.optionsContainer}>
              <TouchableOpacity style={styles.smallCard} activeOpacity={0.7} onPress={askToLogout}>
                <View style={styles.content}>
                  <SimpleLineIcons name="logout" size={22} color="orange" />
                  <Text style={[styles.text, { color }]}>Logout</Text>
                </View>
              </TouchableOpacity>
              <TouchableOpacity style={styles.smallCard} activeOpacity={0.7} onPress={askToDelete}>
                <View style={styles.content}>
                  <Ionicons name="trash-outline" size={22} color="#ff003c" />
                  <Text style={[styles.text, { color }]}>Delete Your Account</Text>
                </View>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ScrollView>
    </ThemedView>
  );
};

const primary = "#0c1742";
const styles = StyleSheet.create({
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  // ... all your other styles are fine, just make sure this one is included.
  safeArea: { flex: 1, paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0 },
  themedView: { flex: 1 },
  scrollViewContent: { flexGrow: 1 },
  container: { width: "100%", minHeight: SCREEN_HEIGHT, alignItems: "center", justifyContent: "flex-start", paddingTop: hp(2), position: "relative" },
  childContainer: { width: "100%", paddingHorizontal: wp(4), alignItems: "center" },
  heading: { fontSize: normalize(36), fontWeight: "800", marginBottom: hp(3), alignSelf: "flex-start", paddingLeft: wp(2) },
  cardPrimary: { width: isTablet() ? wp(80) : wp(92), backgroundColor: primary, borderRadius: normalize(16), padding: normalize(14), flexDirection: "row", alignItems: "center", marginBottom: hp(3), shadowColor: "#000", shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 4.65, elevation: 8, minHeight: hp(18) },
  modCircle: { width: normalize(70), height: normalize(70), borderRadius: normalize(55), justifyContent: "center", alignItems: "center", overflow: "hidden" },
  iconContainer: { width: "100%", height: "100%", justifyContent: "center", alignItems: "center" },
  profileImage: { width: "100%", height: "100%", resizeMode: "cover" },
  boxText: { flex: 1, paddingHorizontal: wp(4), justifyContent: "center" },
  name: { color: "white", fontWeight: "700", fontSize: normalize(20), marginBottom: hp(1) },
  email: { marginTop: 1, color: "gray", fontWeight: "400", fontSize: normalize(12) },
  phone: { marginTop: 4, color: "#eeeeee" },
  optionsContainer: { width: "100%", alignItems: "center", marginTop: hp(2) },
  smallCard: { width: isTablet() ? wp(80) : wp(92), backgroundColor: primary, borderRadius: normalize(16), padding: normalize(18), flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: hp(2.5), shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.25, shadowRadius: 3.84, elevation: 5, minHeight: hp(9) },
  content: { flexDirection: "row", alignItems: "center" },
  text: { fontSize: normalize(16), fontWeight: "600", marginLeft: wp(4) },
});

export default TabTwoScreen;
