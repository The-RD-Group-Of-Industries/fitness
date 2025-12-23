import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Dimensions,
  PixelRatio,
  ScrollView,
  Alert,
  TextInput,
  Modal,
  ActivityIndicator, // Imported for loading spinner
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons, SimpleLineIcons } from "@expo/vector-icons";
import { ThemedView } from "@/components/ThemedView";
import { useAuth } from "@/context/AuthContext";
import { apiClient } from "@/lib/api";

// --- Helper functions ---
const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");
const baseWidth = 375;
const wp = (percentage: number): number => (percentage * SCREEN_WIDTH) / 100;
const hp = (percentage: number): number => (percentage * SCREEN_HEIGHT) / 100;
const normalize = (size: number): number => {
  const scale = SCREEN_WIDTH / baseWidth;
  const newSize = size * scale * 1.2;
  return Math.round(PixelRatio.roundToNearestPixel(newSize));
};
const isTablet = (): boolean =>
  (SCREEN_WIDTH < SCREEN_HEIGHT ? SCREEN_WIDTH : SCREEN_HEIGHT) >= 600;

const TabTwoScreen: React.FC = () => {
  // 1. Get setUser from AuthContext to update state manually
  const { logout, user, setUser } = useAuth();
  const color = "white";

  // 2. State management
  const [changeNumber, setChangeNumber] = useState(false);
  const [phone, setPhone] = useState(user?.phone || "");
  const [isUpdating, setIsUpdating] = useState(false); // Loading state

  useEffect(() => {
    // Sync state if user loads late (e.g. on first render)
    if (user?.phone) setPhone(user.phone);
  }, [user]);

  const deleteAccount = async () => {
    try {
      const req = await apiClient.delete("/api/mobile/user");
      if (req.status === 200) {
        logout();
      }
    } catch (error) {
      console.error("Error deleting account:", error);
      Alert.alert("Error", "Failed to delete account.");
    }
  };

  const handleAddPhone = async () => {
    const value = phone.trim();
    if (value.length < 10) {
      Alert.alert(
        "Invalid Phone Number",
        "Please enter a valid number (at least 10 digits)."
      );
      return;
    }

    try {
      setIsUpdating(true); // Start loading (Disable button)
      
      const req = await apiClient.put("/api/mobile/phone", { phone: value });

      if (req.status === 200) {
        
        // 3. Update local User Context IMMEDIATELY
        if (user) {
            // This updates the UI instantly without waiting for a reload
            setUser({ ...user, phone: value });
        }

        Alert.alert("Success", "Phone number updated successfully.");
        setChangeNumber(false);
      }
    } catch (error) {
      console.error("Error updating phone:", error);
      Alert.alert("Error", "Failed to update phone number.");
    } finally {
      setIsUpdating(false); // Stop loading
    }
  };

  const askToDelete = () => {
    Alert.alert("Delete Account", "Are you sure? This cannot be undone.", [
      { text: "Cancel", style: "cancel" },
      { text: "Delete", style: "destructive", onPress: deleteAccount },
    ]);
  };

  const askToLogout = logout;

  return (
    <ThemedView>
      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        <View style={styles.container}>
          {/* --- PHONE NUMBER MODAL --- */}
          <Modal
            visible={changeNumber}
            transparent
            animationType="fade"
            onRequestClose={() => !isUpdating && setChangeNumber(false)} // Prevent closing while saving
          >
            <View style={styles.modalBackdrop}>
              <View style={styles.modalCard}>
                <Text style={styles.modalTitle}>Update Phone Number</Text>
                <Text style={styles.modalSubtitle}>
                  Enter your mobile number below
                </Text>

                <TextInput
                  style={styles.input}
                  placeholder="+91 9876543210"
                  placeholderTextColor="#888"
                  keyboardType="phone-pad"
                  value={phone}
                  onChangeText={setPhone}
                  editable={!isUpdating} // Disable input while saving
                />

                <View style={styles.modalButtons}>
                  <TouchableOpacity
                    style={[styles.btn, styles.btnCancel]}
                    onPress={() => setChangeNumber(false)}
                    disabled={isUpdating}
                  >
                    <Text style={styles.btnText}>Cancel</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[styles.btn, styles.btnSave, isUpdating && { opacity: 0.7 }]}
                    onPress={handleAddPhone}
                    disabled={isUpdating}
                  >
                    {isUpdating ? (
                        <ActivityIndicator color="#fff" size="small" />
                    ) : (
                        <Text style={styles.btnText}>Save</Text>
                    )}
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </Modal>
          {/* --------------------------- */}

          <View style={styles.childContainer}>
            <Text style={[styles.heading, { color }]}>My Account</Text>

            <View style={styles.cardPrimary}>
              <LinearGradient
                colors={["#704CC5", "#465EC2"]}
                style={styles.modCircle}
              >
                {user?.image ? (
                  <Image
                    source={{ uri: user?.image }}
                    style={styles.profileImage}
                  />
                ) : (
                  <View style={styles.iconContainer}>
                    <Ionicons
                      name="person"
                      size={normalize(32)}
                      color={color}
                    />
                  </View>
                )}
              </LinearGradient>

              <View style={styles.boxText}>
                <Text style={styles.name} numberOfLines={1}>
                  {user?.name || "Guest"}
                </Text>
                <Text style={styles.email} numberOfLines={1}>
                  {user?.email}
                </Text>

                <View
                  style={{ flexDirection: "row", alignItems: "center", gap: 8 }}
                >
                  <Text
                    style={[styles.email, styles.phone]}
                    numberOfLines={1}
                  >
                    {user?.phone || "Add Phone No."}
                  </Text>
                  <TouchableOpacity
                    style={{ marginTop: 4 }}
                    onPress={() => setChangeNumber(true)}
                  >
                    <Ionicons name="pencil" size={16} color="white" />
                  </TouchableOpacity>
                </View>
              </View>
            </View>

            <View style={styles.optionsContainer}>
              <TouchableOpacity
                style={styles.smallCard}
                activeOpacity={0.7}
                onPress={askToLogout}
              >
                <View style={styles.content}>
                  <SimpleLineIcons name="logout" size={22} color="orange" />
                  <Text style={[styles.text, { color }]}>Logout</Text>
                </View>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.smallCard}
                activeOpacity={0.7}
                onPress={askToDelete}
              >
                <View style={styles.content}>
                  <Ionicons name="trash-outline" size={22} color="#ff003c" />
                  <Text style={[styles.text, { color }]}>
                    Delete Your Account
                  </Text>
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
  scrollViewContent: { flexGrow: 1 },
  container: {
    width: "100%",
    minHeight: SCREEN_HEIGHT,
    alignItems: "center",
    justifyContent: "flex-start",
    paddingTop: hp(2),
  },
  childContainer: {
    width: "100%",
    paddingHorizontal: wp(4),
    alignItems: "center",
  },
  heading: {
    fontSize: normalize(36),
    fontWeight: "800",
    marginBottom: hp(3),
    alignSelf: "flex-start",
    paddingLeft: wp(2),
  },
  cardPrimary: {
    width: isTablet() ? wp(80) : wp(92),
    backgroundColor: primary,
    borderRadius: normalize(16),
    padding: normalize(14),
    flexDirection: "row",
    alignItems: "center",
    marginBottom: hp(3),
    elevation: 8,
    minHeight: hp(18),
  },
  modCircle: {
    width: normalize(70),
    height: normalize(70),
    borderRadius: normalize(35),
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
  },
  iconContainer: {
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  profileImage: { width: "100%", height: "100%", resizeMode: "cover" },
  boxText: { flex: 1, paddingHorizontal: wp(4), justifyContent: "center" },
  name: {
    color: "white",
    fontWeight: "700",
    fontSize: normalize(20),
    marginBottom: hp(1),
  },
  email: {
    marginTop: 1,
    color: "gray",
    fontWeight: "400",
    fontSize: normalize(12),
  },
  phone: { marginTop: 4, color: "#eeeeee" },
  optionsContainer: { width: "100%", alignItems: "center", marginTop: hp(2) },
  smallCard: {
    width: isTablet() ? wp(80) : wp(92),
    backgroundColor: primary,
    borderRadius: normalize(16),
    padding: normalize(18),
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: hp(2.5),
    elevation: 5,
    minHeight: hp(9),
  },
  content: { flexDirection: "row", alignItems: "center" },
  text: { fontSize: normalize(16), fontWeight: "600", marginLeft: wp(4) },

  // --- Modal Styles ---
  modalBackdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.6)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalCard: {
    width: "85%",
    backgroundColor: "#1B2236",
    borderRadius: 16,
    padding: 24,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#306BFF",
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 8,
  },
  modalSubtitle: { fontSize: 14, color: "#aaa", marginBottom: 20 },
  input: {
    width: "100%",
    backgroundColor: "#0c1742",
    borderRadius: 8,
    padding: 14,
    color: "#fff",
    fontSize: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "#306BFF",
  },
  modalButtons: { flexDirection: "row", gap: 12, width: "100%" },
  btn: { flex: 1, padding: 14, borderRadius: 8, alignItems: "center" },
  btnCancel: { backgroundColor: "#333" },
  btnSave: { backgroundColor: "#306BFF" },
  btnText: { color: "#fff", fontWeight: "600", fontSize: 16 },
});

export default TabTwoScreen;
