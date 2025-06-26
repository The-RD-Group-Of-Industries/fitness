import Trainer from '@/components/main/Trainer';
import Upcoming from '@/components/main/Upcoming';
import { ThemedView } from '@/components/ThemedView';
import { FontAwesome } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { StyleSheet, ScrollView, View, Text, TouchableOpacity, Dimensions, PixelRatio } from 'react-native';
import * as Device from 'expo-device';



const { width: screenWidth } = Dimensions.get('window');
const isTablet = Device.deviceType === Device.DeviceType.TABLET;
const boxWidth = isTablet ? screenWidth * 0.49 :screenWidth * 0.464;

export default function HomeScreen() {
  const router = useRouter();
  const data = [
    {
      title: "Chat",
      Icon: "wechat",
      background: {
        stop_1: "teal",
        stop_2: "seagreen",
      },
      onClick: () => router.push("/chats")
    },
    {
      title: "Book Session",
      Icon: "clock-o",
      background: {
        stop_1: "#9616f2",
        stop_2: "#42009e",
      },
      onClick: () => router.push("/session")
    },
  ];

  return (
    <ThemedView style={{paddingTop: -35}}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        style={{ paddingHorizontal: 6 }}
      >
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 8 }}>
          <View style={styles.row}>
            {data.map((items, index) => (
              <TouchableOpacity onPress={items.onClick} key={index} activeOpacity={0.85}>
                <LinearGradient
                  colors={[items.background.stop_1, items.background.stop_2]}
                  start={{ x: 1, y: 0 }}
                  end={{ x: 0, y: 0.4 }}
                  style={styles.box}
                >
                  <FontAwesome name={items.Icon as "wechat" | "clock-o"} size={36} color="white" />
                  <Text style={styles.text}>{items.title}</Text>
                </LinearGradient>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>

        <Trainer />
        <Upcoming />
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  row: {
    width: screenWidth,
    flexDirection: 'row',
    alignItems: 'center',
  },
  box: {
    width: boxWidth ,
    height: isTablet ? boxWidth * 0.25 : boxWidth * 0.85,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8, // Reduced spacing
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 3,
  },
  text: {
    color: 'white',
    fontSize: 15,
    marginTop: 8,
    fontWeight: '600',
    textAlign: 'center',
  }
});
