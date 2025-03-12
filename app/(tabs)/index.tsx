import Trainer from '@/components/main/Trainer';
import Upcoming from '@/components/main/Upcoming';
import { ThemedView } from '@/components/ThemedView';
import { useThemeColor } from '@/hooks/useThemeColor';
import { FontAwesome } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import {  StyleSheet, ScrollView, View, Text, TouchableOpacity } from 'react-native';


export default function HomeScreen() {
    const color = useThemeColor({ light: "black", dark: "white" }, 'text');
    const router = useRouter();
    const data = [
      {
        title: "Chat",
        Icon: "wechat",
        background: {
          stop_1: "teal",
          stop_2: "seagreen",
        },
        onClick: () => {
          router.push("/chats")
        }
      },
      {
        title: "Book Session",
        Icon: "clock-o",
        background: {
          stop_1: "#9616f2",
          stop_2: "#42009e",
        },
        onClick: () => {
          router.push("/session")
        }
      },
      // {
      //   title: "Community",
      //   Icon: "group",
      //   background: {
      //     stop_1: "#ff4d7f",
      //     stop_2: "#6e0120",
      //   },
      //   onClick: () => {}
      // },
    ]
  return (
  <ThemedView style={styles.top}>
  <ScrollView 
  contentContainerStyle={styles.contentContainer}
  showsVerticalScrollIndicator={false}
  // style={styles.container}
  style={{padding: 10, paddingVertical: 30}}>
   <ScrollView horizontal style={styles.col} showsHorizontalScrollIndicator={false}>
    <View style={styles.row}>
     {
       data.map((items, index) => (
         <TouchableOpacity onPress={items.onClick} key={index}>
        <LinearGradient
        colors={[items.background.stop_1, items.background.stop_2]}
        start={{x: 1, y: 0}}
        end={{y: 0.4, x: 0}}
        style={styles.box}
        >
        <View style={[styles.box]}>
        <FontAwesome name={items.Icon} size={38} color="white" />
        <Text style={styles.text}>{items.title}</Text>
        </View>
        </LinearGradient>
      </TouchableOpacity>
        ))
      }
      </View>
    </ScrollView>


  <Trainer />
  <Upcoming />


  </ScrollView>
</ThemedView>
  );
}

const styles = StyleSheet.create({
  top: {
    flex: 1,
    backgroundColor: "#090E21"
  },
  contentContainer: {
    paddingBottom: 50,
    // backgroundColor: 'red'
  },
  col: {
    flex: 1
  },
  row: {
    flexDirection: 'row',
    gap: 8,
  },
    box: {
      width: 165,
      height: 140,
      borderRadius: 12,
      justifyContent: 'center',
      alignItems: 'center'
    },
    text: {
      color: 'white',
      fontSize: 18,
      marginTop: 12,
      fontWeight: '600'
    }
});
