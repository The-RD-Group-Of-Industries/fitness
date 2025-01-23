import { useThemeColor } from "@/hooks/useThemeColor";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function TabTwoScreen() {
  const color = useThemeColor({ light: "black", dark: "white" }, "text");

  const options = [
    {
      title: "Cardio",
      min: 30,
      cal: 150,
      background: {
        stop_1: "#1B46AE",
        stop_2: "#3069f2",
      },
      IconName: "cards-heart",
    },
    {
      title: "Strength",
      min: 30,
      cal: 150,
      background: {
        stop_1: "#6723A6",
        stop_2: "#901efa",
      },
      IconName: "dumbbell",
    },
    {
      title: "Yoga",
      min: 30,
      cal: 150,
      background: {
        stop_1: "#127939",
        stop_2: "#0cc452",
      },
      IconName: "yoga",
    },
    {
      title: "Cycling",
      min: 30,
      cal: 150,
      background: {
        stop_1: "#d96500",
        stop_2: "#ff8a24",
      },
      IconName: "bicycle",
    },
  ];
  return (
    <View style={styles.container}>
    <ScrollView showsVerticalScrollIndicator={false}>

      <View style={styles.child}>
        <Text style={[styles.heading, { color }]}>Today's Workout</Text>
      <View style={styles.content}><Text
      style={{color: 'white'}}
      >Coming soon</Text></View>
        <View style={styles.outerBox}>
          {
            options.map((items, index) => (
              <TouchableOpacity
              key={index}
              style={[styles.box, { padding: 0, paddingHorizontal: 0 }]}
          >
            <LinearGradient
              colors={[items.background.stop_1, items.background.stop_2]}
              start={{ x: 0.3, y: 0.5 }}
              end={{ x: 1, y: 1 }}
              style={[styles.box, { width: "100%", height: "100%" }]}
            >
              <MaterialCommunityIcons name={items.IconName} size={38} color="white" />

              <Text style={styles.head}>{items.title}</Text>
              <Text style={styles.subhead}>{items.min}min • {items.cal} kcal</Text>

              <Text style={styles.button}>Start Now</Text>
            </LinearGradient>
          </TouchableOpacity>
            ))
          }
        </View>
      </View>
</ScrollView>
    </View>
  );
}

const primary = "#090E21";

const styles = StyleSheet.create({
  container: {
    justifyContent: "flex-start",
    alignItems: "flex-start",
    height: "100%",
  },
  child: {
    marginTop: 60,
    paddingHorizontal: 10,
    gap: 10,
  },
  heading: {
    fontSize: 32,
    fontWeight: "800",
    marginBottom: "2%",
  },
  outerBox: {
    width: "auto",
    height: "55%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    flexWrap: "wrap",
    gap: 10,
    padding: 4,
  },
  box: {
    width: "48%",
    height: "95%",
    borderRadius: 12,
    overflow: "hidden",
    padding: 10,
    paddingBottom: 0,
    paddingHorizontal: "6%",
  },
  head: {
    color: "white",
    fontWeight: "700",
    fontSize: 24,
    marginTop: 22,
  },
  subhead: {
    fontSize: 16,
    fontWeight: "600",
    marginTop: 0,
    color: "white",
  },
  button: {
    width: "100%",
    paddingHorizontal: 8,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: "#ffffff30",
    backdropFilter: "blur(10px)",
    marginTop: 24,
    color: "white",
    textAlign: "center",
    fontWeight: '600'
  },
  content: {
    width: "100%",
    paddingHorizontal: 12,
    paddingVertical: 14,
    flexDirection: 'row',
    backgroundColor: '#0B1634',
    borderRadius: 10
  }
});
