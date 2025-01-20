import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import React from "react";
import { LinearGradient } from "expo-linear-gradient";

export default function Upcoming() {
  return (
    <View style={css.container}>
      <Text style={css.heading}>Upcoming</Text>

      <View style={css.box}>
        <Text style={css.text}>Today 2PM</Text>
        <Text style={css.title}>HIIT Cardio Blast</Text>
        <Text style={css.trainerName}>With Sarah Wilson</Text>
        <LinearGradient
        colors={['#08027a', '#382eff']}
        start={{x: 1, y: 0.9}}
        end={{x: 0.3, y: 0.8}}
        style={css.button}
        >
        <TouchableOpacity>
          <Text style={css.btnText}>Join Now</Text>
        </TouchableOpacity>
        </LinearGradient>
      </View>


      <View style={css.box}>
        <Text style={css.text}>Today 2PM</Text>
        <Text style={css.title}>HIIT Cardio Blast</Text>
        <Text style={css.trainerName}>With Sarah Wilson</Text>
        <LinearGradient
        colors={['#08027a', '#382eff']}
        start={{x: 1, y: 0.9}}
        end={{x: 0.3, y: 0.8}}
        style={css.button}
        >
        <TouchableOpacity>
          <Text style={css.btnText}>Join Now</Text>
        </TouchableOpacity>
        </LinearGradient>
      </View>
      
    </View>
  );
}

const css = StyleSheet.create({
  container: {
    marginTop: 40,
    paddingHorizontal: 10,
  },
  heading: {
    fontSize: 34,
    fontWeight: "900",
    color: "white",
  },
  box: {
    width: "100%",
    height: 200,
    backgroundColor: "##3246a840",
    borderRadius: 14,
    marginVertical: 10,
    borderWidth: 1,
    borderColor: "#3246a8",
    padding: 10,
    position: "relative",
  },
  text: {
    position: "absolute",
    right: 20,
    top: 12,
    fontSize: 20,
    fontWeight: "900",
    color: "white",
  },
  title: {
    color: "white",
    fontSize: 20,
    paddingTop: 40,
    fontWeight: "800",
  },
  trainerName: {
    color: "gray",
    marginTop: 4,
    fontSize: 16,
    fontWeight: "600",
  },
  button: {
    position: "absolute",
    bottom: 10,
    left: 10,
    width: "100%",
    paddingVertical: 10,
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
