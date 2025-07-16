import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
  Platform,
  KeyboardAvoidingView,
  Keyboard,
} from "react-native";
import React, { useState } from "react";
import { Stack, useRouter } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import DateTimePicker, { DateTimePickerEvent } from "@react-native-community/datetimepicker";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { ThemedView } from "@/components/ThemedView";

const DisplayBox = ({
  title,
  children,
  long = false,
}: {
  title: string;
  children: React.ReactNode;
  long?: boolean;
}) => (
  <View style={styles.box}>
    <Text style={styles.text}>{title}</Text>
    <View style={long ? styles.col : styles.row}>{children}</View>
  </View>
);

export default function Session() {
  const sessionTypes = [
    {
      title: "Personal Training",
      subTitle: "1-on-1 session",
      charge: 799,
      value: "personal",
    },
  ];

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const [date, setDate] = useState(new Date());
  const [startTime, setStartTime] = useState(new Date());
  const [endTime, setEndTime] = useState(new Date(new Date().getTime() + 60 * 60 * 1000));
  const [sessionType, setSessionType] = useState(sessionTypes[0].value);
  const [loading, setLoading] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showStartTimePicker, setShowStartTimePicker] = useState(false);

  const router = useRouter();

  const handleSubmit = async () => {
    try {
      setLoading(true);
      const token = await AsyncStorage.getItem("userToken");
      await axios.post(
        "https://fitness-admin-tau.vercel.app/api/mobile/schedule/create",
        {
          date: date.toISOString(),
          startTime: startTime.toISOString(),
          endTime: endTime.toISOString(),
          scheduleSubject: "Training Session",
          sessionType,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      Alert.alert("Success", "Session scheduled successfully!", [
        { text: "OK", onPress: () => router.push("/(tabs)") },
      ]);
    } catch (error) {
      console.error("Error scheduling session:", error);
      Alert.alert("Error", "Failed to schedule session");
    } finally {
      setLoading(false);
    }
  };

  const onChangeDate = (event: DateTimePickerEvent, selectedDate?: Date) => {
    if (selectedDate) {
      if (selectedDate < today) {
        Alert.alert("Invalid Date", "You cannot select a past date.");
      } else {
        setDate(selectedDate);
        const newStart = new Date(selectedDate);
        newStart.setHours(startTime.getHours(), startTime.getMinutes());
        setStartTime(newStart);
        setEndTime(new Date(newStart.getTime() + 60 * 60 * 1000));
      }
    }
    setShowDatePicker(Platform.OS === "ios");
  };

  const onChangeStartTime = (event: DateTimePickerEvent, selectedTime?: Date) => {
    if (selectedTime) {
      const currentTime = new Date();
      if (selectedTime < currentTime) {
        setStartTime(currentTime);
        setEndTime(new Date(currentTime.getTime() + 60 * 60 * 1000));
        Alert.alert("Invalid Time", "You cannot select a time in the past");
      } else {
        setStartTime(selectedTime);
        setEndTime(new Date(selectedTime.getTime() + 60 * 60 * 1000));
      }
    }
    setShowStartTimePicker(Platform.OS === "ios");
  };

  const formatDate = (date: Date) => {
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const formatTime = (time: Date) => {
    let hours = time.getHours();
    let minutes = time.getMinutes();
    const ampm = hours >= 12 ? "PM" : "AM";

    hours = hours % 12;
    hours = hours ? hours : 12;
    minutes = minutes < 10 ? 0 + minutes : minutes;

    return `${hours}:${minutes} ${ampm}`;
  };

  return (
    <ThemedView style={{ flex: 1 }}>
      <Stack.Screen
        options={{
          headerTitle: "Book a session",
          headerBackButtonDisplayMode: "minimal",
          headerStyle: { backgroundColor: "#090E26" },
          headerTintColor: "#fff",
        }}
      />

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={{ flex: 1 }}
      >
        <ScrollView
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.contentContainer}
        >
          <View style={styles.container}>
            <View style={styles.child}>
              <Text style={styles.heading}>Book Training Session</Text>

              <DisplayBox title="Schedule">
                <View style={styles.dateTimeContainer}>
                  <TouchableOpacity
                    style={styles.dateTimePicker}
                    onPress={() => {
                      Keyboard.dismiss();
                      setTimeout(() => setShowDatePicker(true), 100);
                    }}
                  >
                    <Text style={styles.dateTimeLabel}>Date:</Text>
                    <Text style={styles.dateTimeValue}>{formatDate(date)}</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.dateTimePicker}
                    onPress={() => {
                      Keyboard.dismiss();
                      setTimeout(() => setShowStartTimePicker(true), 100);
                    }}
                  >
                    <Text style={styles.dateTimeLabel}>Start Time:</Text>
                    <Text style={styles.dateTimeValue}>{formatTime(startTime)}</Text>
                  </TouchableOpacity>

                  <View style={styles.dateTimePicker}>
                    <Text style={styles.dateTimeLabel}>End Time:</Text>
                    <Text style={styles.dateTimeValue}>{formatTime(endTime)} (+60min)</Text>
                  </View>
                </View>
              </DisplayBox>

              {showDatePicker && (
                <View style={styles.pickerContainer}>
                  <DateTimePicker
                    value={date}
                    mode="date"
                    is24Hour={true}
                    display={Platform.OS === "ios" ? "spinner" : "default"}
                    onChange={onChangeDate}
                    minimumDate={new Date()}
                    maximumDate={new Date(new Date().setMonth(new Date().getMonth() + 3))}
                    themeVariant={"light"}
                    {...(Platform.OS === "ios" && { textColor: "#000" })}
                  />
                </View>
              )}

              {showStartTimePicker && (
                <View style={styles.pickerContainer}>
                  <DateTimePicker
                    value={startTime}
                    mode="time"
                    is24Hour={false}
                    display={Platform.OS === "ios" ? "spinner" : "default"}
                    onChange={onChangeStartTime}
                    themeVariant={"light"}
                    {...(Platform.OS === "ios" && { textColor: "#000" })}
                  />
                </View>
              )}

              <DisplayBox title="Session Type" long>
                {sessionTypes.map((type, index) => (
                  <TouchableOpacity
                    key={index}
                    style={[
                      styles.longBox,
                      sessionType === type.value && styles.selectedBox,
                    ]}
                    onPress={() => setSessionType(type.value)}
                  >
                    <Text style={styles.text}>{type.title}</Text>
                    <Text style={styles.subTxt}>{type.subTitle}</Text>
                  </TouchableOpacity>
                ))}
              </DisplayBox>

              <LinearGradient
                colors={["#08027a", "#382eff"]}
                start={{ x: 1, y: 0.9 }}
                end={{ x: 0.3, y: 0.8 }}
                style={styles.button}
              >
                <TouchableOpacity onPress={handleSubmit} disabled={loading}>
                  <Text style={styles.btnText}>
                    {loading ? "Scheduling..." : "Schedule Session"}
                  </Text>
                </TouchableOpacity>
              </LinearGradient>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  contentContainer: {
    paddingBottom: 100,
  },
  container: {
    justifyContent: "center",
    alignItems: "flex-start",
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
    padding: 14,
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
  longBox: {
    padding: 16,
    paddingVertical: 20,
    borderWidth: 1,
    borderColor: "#3082fc",
    marginTop: 10,
    borderRadius: 8,
  },
  selectedBox: {
    backgroundColor: "#3082fc30",
    borderColor: "#3082fc",
    borderWidth: 2,
  },
  subTxt: {
    color: "gray",
    fontSize: 14,
  },
  button: {
    width: "100%",
    paddingVertical: 15,
    textAlign: "center",
    borderRadius: 8,
    marginTop: 20,
  },
  btnText: {
    textAlign: "center",
    color: "white",
    fontWeight: "600",
    fontSize: 18,
  },
  dateTimeContainer: {
    gap: 10,
    width: "100%",
  },
  dateTimePicker: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 10,
    borderWidth: 1,
    borderColor: "#3082fc",
    borderRadius: 6,
  },
  dateTimeLabel: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
  dateTimeValue: {
    color: "white",
    fontSize: 16,
  },
  pickerContainer: {
    backgroundColor: Platform.OS === "ios" ? "#fff" : "transparent",
    borderRadius: 10,
    padding: 4,
  },
});
