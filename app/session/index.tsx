import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import React from "react";
import { Stack } from "expo-router";
import CustomDropdown from "@/components/ui/DropDown";
import { LinearGradient } from "expo-linear-gradient";

const DisplayBox = ({
  title,
  data,
  long = false,
}: {
  title: string;
  data: any[];
  long?: boolean;
}) => (
  <View style={styles.box}>
    <Text style={styles.text}>{title}</Text>
    <View style={long ? styles.col : styles.row}>
      {!long
        ? data.length > 0 &&
          data.map((items, key) => (
            <TouchableOpacity key={key} style={styles.smallBox}>
              <Text style={styles.txt}>{items?.title}</Text>
              {items.time && <Text style={styles.subTxt}>{items?.time}</Text>}
            </TouchableOpacity>
          ))
        : data.length > 0 &&
          data.map((items, key) => (
            <TouchableOpacity key={key} style={styles.longBox}>
              <Text style={styles.charge}>{items.charge}/hr</Text>
              <Text style={[styles.text]}>{items.title}</Text>
              <Text style={styles.subTxt}>{items.subTitle}</Text>
            </TouchableOpacity>
          ))}
    </View>
  </View>
);

export default function session() {
  const timing = [
    {
      title: "MON",
      time: "10:00 AM",
    },
    {
      title: "MON",
      time: "10:00 AM",
    },
    {
      title: "MON",
      time: "10:00 AM",
    },
  ];

  const duration = [
    {
      title: "30min",
      main: 30,
    },
    {
      title: "30min",
      main: 30,
    },
    {
      title: "30min",
      main: 30,
    },
  ];
  const session = [
    {
      title: "Personal Training",
      subTitle: "1-1 session",
      charge: 299,
    },
    {
      title: "Personal Training",
      subTitle: "1-1 session",
      charge: 299,
    },
    {
      title: "Personal Training",
      subTitle: "1-1 session",
      charge: 299,
    },
  ];
  const items = [
    { label: "NIKKI", value: "NIKKI" },
    { label: "ROHINI", value: "2" },
    { label: "ASHANA", value: "3" },
    { label: "RUBY", value: "4" },
    { label: "AMRIK KAUR", value: "5" },
    { label: "ROHAN", value: "6" },
  ];
  return (
    <>
      <Stack.Screen
        options={{
          headerTitle: "Book a session",
        }}
      />
      <ScrollView
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={styles.contentContainer}
      >
        <View style={styles.container}>
          <View style={styles.child}>
            <Text style={styles.heading}>Book Training Session</Text>
            <DisplayBox title="Available Session" data={timing} />
            <DisplayBox title="Session Type" data={session} long />
            <CustomDropdown data={items} />
            <DisplayBox title="Duration" data={duration} />
                    <LinearGradient
                    colors={['#08027a', '#382eff']}
                    start={{x: 1, y: 0.9}}
                    end={{x: 0.3, y: 0.8}}
                    style={styles.button}
                    >
                    <TouchableOpacity>
                      <Text style={styles.btnText}>Join Now</Text>
                    </TouchableOpacity>
                    </LinearGradient>
          </View>
        </View>
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  contentContainer: {
    paddingBottom: 100,
  },
  dropwon: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#1e1e1e",
  },
  container: {
    justifyContent: "center",
    alignItems: "flex-start",
    height: 'auto',
    position: 'relative',
    // marginBottom: 20,

  },
  child: {
    paddingHorizontal: 10,
    gap: 10,
  },
  heading: {
    fontSize: 28,
    fontWeight: "800",
    color: "white",
    marginBottom: 10,
  },
  box: {
    width: "auto",
    padding: 14,
    height: "auto",
    borderWidth: 1,
    borderColor: "#3082fc",
    borderRadius: 10,
  },
  text: {
    color: "white",
    fontWeight: "700",
    fontSize: 18,
  },
  col: {
    gap: 8,
  },
  row: {
    flexDirection: "row",
    gap: 8,
    justifyContent: "space-between",
    alignItems: "center",
  },
  smallBox: {
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#3082fc",
    padding: 10,
    paddingHorizontal: 14,
    marginVertical: 4,
    borderRadius: 6,
    marginTop: 6,
  },
  longBox: {
    width: "auto",
    height: "auto",
    padding: 16,
    paddingVertical: 20,
    borderWidth: 1,
    borderColor: "#3082fc",
    marginTop: 10,
    borderRadius: 8,
    position: "relative",
  },
  charge: {
    color: "#1277fc",
    fontSize: 16,
    fontWeight: "400",
    position: "absolute",
    right: 8,
    top: 10,
  },
  txt: {
    color: "white",
    fontSize: 16,
  },
  subTxt: {
    color: "gray",
    fontSize: 14,
  },
  menuContainer: {
    backgroundColor: "#1e1e1e",
    borderColor: "#3082fc",
    borderWidth: 1,
  },
  selectedText: {
    color: "white",
    marginTop: 16,
    fontSize: 16,
  },
  button: {
    position: "absolute",
    bottom: -70,
    left: 10,
    width: "95%",
    paddingVertical: 15,
    paddingHorizontal: 10,
    // backgroundColor: 'red',
    textAlign: "center",
    borderRadius: 8,
  },
  btnText: {
    textAlign: "center",
    color: "white",
    fontWeight: "600",
    fontSize: 18,
  },
});
