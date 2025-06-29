import React, { useEffect, useState } from "react";
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  Image, 
  SafeAreaView, 
  Dimensions, 
  Platform, 
  StatusBar,
  PixelRatio,
  ScrollView,
  Alert
} from "react-native";
import { useThemeColor } from "@/hooks/useThemeColor";
import { LinearGradient } from "expo-linear-gradient";
import { Feather, Ionicons, SimpleLineIcons } from "@expo/vector-icons";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { ThemedView } from "@/components/ThemedView";
import { useAuth } from "@/context/AuthContext";


// Get the screen dimensions
const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

// Calculate pixel density for different devices
const pixelDensity = PixelRatio.get();

// Base width used for scaling (iPhone 11 width)
const baseWidth = 375;
const baseHeight = 812;

// Scaling helpers for truly responsive UI
const wp = (percentage: number): number => {
  return (percentage * SCREEN_WIDTH) / 100;
};

const hp = (percentage: number): number => {
  return (percentage * SCREEN_HEIGHT) / 100;
};

// We'll adjust the normalize factor to make elements larger
const normalize = (size: number): number => {
  const scale = SCREEN_WIDTH / baseWidth;
  const newSize = size * scale * 1.2; // Increased by 20%
  
  if (Platform.OS === 'ios') {
    return Math.round(PixelRatio.roundToNearestPixel(newSize));
  } else {
    return Math.round(PixelRatio.roundToNearestPixel(newSize)) - 2;
  }
};

// Get device type
const isTablet = (): boolean => {
  let dimension = SCREEN_WIDTH < SCREEN_HEIGHT ? SCREEN_WIDTH : SCREEN_HEIGHT;
  return dimension >= 600;
};

interface UserData {
  name: string | null;
  email: string | null;
  image: string | null;
}

interface OptionItem {
  title: string;
  Icon: any;
  iconName: string;
  iconColor: string;
}

const TabTwoScreen: React.FC = () => {
  const { logout } = useAuth()
  const color = "white";
  const [userData, setUserData] = useState<UserData | null>(null);
  const [dimensions, setDimensions] = useState({
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT
  });

  // Handle orientation changes
  useEffect(() => {
    const subscription = Dimensions.addEventListener('change', ({ window }) => {
      setDimensions({
        width: window.width,
        height: window.height
      });
    });

    return () => subscription.remove();
  }, []);

  useEffect(() => {
    const fetchUserData = async (): Promise<void> => {
      try {
        const token = await AsyncStorage.getItem("userToken");
        const response = await axios.get<{user: UserData}>(
          "https://fitness-admin-tau.vercel.app/api/mobile/user", 
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setUserData(response.data.user);
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUserData();
  }, []);

  const deleteAccount = async () => {
    try {
      const token = await AsyncStorage.getItem("userToken");
      const req = await axios.delete("https://fitness-admin-tau.vercel.app/api/mobile/user", {
        headers: { Authorization: `Bearer ${token}` },
      });
      await AsyncStorage.removeItem("userToken");
      if (req.status === 200) {
        logout();
      }
    } catch (error) {
      console.error("Error deleting account:", error);
    }
  }

  function askToDelete() {
    Alert.alert(
      "Delete Account",
      "Are you sure you want to delete your account?\n\nThis action cannot be undone!",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Delete",
          style: "destructive",
          onPress: deleteAccount,
        },
      ],
      { cancelable: true }
    );
  }

  function askToLogout() {
    Alert.alert(
      "Logout",
      "Are you sure you want to logout?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Logout",
          style: "destructive",
          onPress: logout,
        },
      ],
      { cancelable: true }
    );
  }

  const options: OptionItem[] = [
    // {
    //   title: "Settings",
    //   Icon: Feather,
    //   iconName: "settings",
    //   iconColor: "#2196f3",
    // },
    // {
    //   title: "Workout History",
    //   Icon: Fontisto,
    //   iconName: "history",
    //   iconColor: "#ff686b",
    // },
    // {
    //   title: "Achivements",
    //   Icon: Entypo,
    //   iconName: "medal",
    //   iconColor: "#ffd23f",
    // },
    // {
    //   title: "Help & Support",
    //   Icon: Entypo,
    //   iconName: "help-with-circle",
    //   iconColor: "#eb5e28",
    // },
  ];
  
  return (
      <ThemedView>
    {/* <SafeAreaView style={styles.safeArea}> */}
        <ScrollView 
          contentContainerStyle={styles.scrollViewContent}
          showsVerticalScrollIndicator={false}
          bounces={true}
        >
          <View style={styles.container}>
            <View style={styles.childContainer}>
              <Text style={[styles.heading, { color }]}>My Account</Text>

              <View style={styles.cardPrimary}>
                <LinearGradient
                  colors={["#704CC5", "#465EC2"]}
                  style={styles.modCircle}
                  start={{ x: 0.3, y: 1 }}
                  end={{ y: 0, x: 0.3 }}
                >
                  {userData && userData.image ? (
                    <Image source={{ uri: userData.image }} style={styles.profileImage} />
                  ) : (
                    <View style={styles.iconContainer}>
                      <Ionicons name="person" size={normalize(32)} color={color} />
                    </View>
                  )}
                </LinearGradient>
                <View style={styles.boxText}>
                  <Text style={styles.name} numberOfLines={1} ellipsizeMode="tail">
                    {userData?.name || "Loading..."}
                  </Text>
                  <Text style={styles.email} numberOfLines={1} ellipsizeMode="tail">
                    {userData?.email || "Loading..."}
                  </Text>
                </View>
              </View>

              <View style={styles.optionsContainer}>
                {options.map((item: OptionItem, index: number) => (
                  <TouchableOpacity key={index} style={styles.smallCard} activeOpacity={0.7}>
                    <View style={styles.content}>
                      <item.Icon name={item.iconName} size={normalize(22)} color={item.iconColor} />
                      <Text style={[styles.text, { color }]}>{item.title}</Text>
                    </View>
                    <Feather name="arrow-right-circle" size={normalize(24)} color="#f2f2f2" />
                  </TouchableOpacity>
                ))}

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
    {/* </SafeAreaView> */}
      </ThemedView>
  );
};

const primary = "#0c1742";

// Completely redesigned styles with larger elements and scrolling support
const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
  themedView: {
    flex: 1,
  },
  scrollViewContent: {
    flexGrow: 1,
    // paddingBottom: hp(5), // Add padding at bottom for scrolling
  },
  container: {
    width: '100%',
    minHeight: SCREEN_HEIGHT, // Ensure full height for smaller content
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingTop: hp(2),
  },
  childContainer: {
    width: '100%',
    paddingHorizontal: wp(4),
    alignItems: 'center',
  },
  heading: {
    fontSize: normalize(36), // Increased size
    fontWeight: '800',
    marginBottom: hp(3),
    alignSelf: 'flex-start',
    paddingLeft: wp(2),
  },
  cardPrimary: {
    width: isTablet() ? wp(80) : wp(92),
    backgroundColor: primary,
    borderRadius: normalize(16),
    padding: normalize(14), // Increased padding
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: hp(3), // Increased margin
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8,
    minHeight: hp(18), // Ensure minimum height
  },
  modCircle: {
    width: normalize(70),
    height: normalize(70),
    borderRadius: normalize(55),
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  iconContainer: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  boxText: {
    flex: 1,
    paddingHorizontal: wp(4),
    justifyContent: 'center',
  },
  name: {
    color: 'white',
    fontWeight: '700',
    fontSize: normalize(20), // Increased size
    marginBottom: hp(1),
  },
  email: {
    color: 'gray',
    fontWeight: '400',
    fontSize: normalize(12), // Increased size
  },
  optionsContainer: {
    width: '100%',
    alignItems: 'center',
    marginTop: hp(2),
  },
  smallCard: {
    width: isTablet() ? wp(80) : wp(92),
    backgroundColor: primary,
    borderRadius: normalize(16),
    padding: normalize(18), // Increased padding
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: hp(2.5), // Increased margin
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    minHeight: hp(9), // Ensure minimum height
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  text: {
    fontSize: normalize(16), // Increased text size
    fontWeight: '600',
    marginLeft: wp(4), // Increased spacing
  },
});

export default TabTwoScreen;