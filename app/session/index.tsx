import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
  Platform,
  SafeAreaView,
  StatusBar,
  useColorScheme,
  Keyboard,
  TextInput,
  ActivityIndicator 
} from "react-native";
import type React from "react";
import { useEffect, useState } from "react";
import { Stack } from "expo-router";
import CustomDropdown from "@/components/ui/DropDown";
import { LinearGradient } from "expo-linear-gradient";
import DateTimePicker, {
  type DateTimePickerEvent,
} from "@react-native-community/datetimepicker";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import { ThemedView } from "@/components/ThemedView";
import TimeSelector from "@/components/TimeSelectorIOS";
import { createSchedule } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import * as SecureStore from 'expo-secure-store';


interface JwtPayload {
  userId: string;  // or use the key you stored the user ID under, e.g., "id" or "sub"
  // add other fields if needed
}


interface Trainer {
  id: string;
  name: string | null;
  email: string;
}

interface DropdownItem {
  label: string;
  value: string;
}

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
    {
      title: "Group Training",
      subTitle: "Up to 5 people",
      charge: 199,
      value: "group",
    },
  ];
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const [trainers, setTrainers] = useState<DropdownItem[]>([]);
  const [selectedTrainer, setSelectedTrainer] = useState("");
  const [date, setDate] = useState(new Date());
  const [startTime, setStartTime] = useState(new Date());
  const [endTime, setEndTime] = useState(
    new Date(new Date().getTime() + 1 * 60 * 60 * 1000)
  );
  const [sessionType, setSessionType] = useState(sessionTypes[0].value);
  const [loading, setLoading] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showStartTimePicker, setShowStartTimePicker] = useState(false);
  const router = useRouter();
  const {user}= useAuth();
  const colorScheme = useColorScheme();

  console.log("user in session index",user);
  

    if (!user) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#ffffff" />
      </View>
    );
  }

  // Keyboard dismiss handlers
  const handleDatePickerOpen = () => {
    Keyboard.dismiss();
    setTimeout(() => setShowDatePicker(true), 100);
  };

  const handleStartTimePickerOpen = () => {
  Keyboard.dismiss();
  setTimeout(() => {
    setShowStartTimePicker(true);
    console.log("showStartTimePicker set to true"); // Add this debug line
  }, 100);
};
const scheduleLink = "helloLink";
const scheduleDescription = "helloDescriptiton";
const scheduleImg = "helloImg";
const affectedArea ="Area";
const userId=user._id
const trainerId ='691313d10c0dc1d3e60c8ba0'



  const handleSubmit = async () => {
    // ...your checks
    try {
      setLoading(true);
      const token = await SecureStore.getItemAsync("token");
      await createSchedule({
  date: date.toISOString(),           // Date object converted to ISO string
  startTime: startTime.toISOString(), // Date object converted to ISO string
  endTime: endTime.toISOString(),     // Date object converted to ISO string
  scheduleLink: scheduleLink || "",   // Optional, provide a string or empty string
  scheduleSubject: "Training Session",// Example subject, must be non-empty string
  scheduleDescription: scheduleDescription || "", // Optional description
  scheduleImg: scheduleImg || "",     // Optional image URL or base64 string
  affectedArea: affectedArea || "",   // Optional affected area
  userId: userId,                     // Must be a valid user ObjectId string
  trainerId: trainerId                // Must be a valid trainer ObjectId string
});

      Alert.alert("Success", "Session scheduled successfully!", [
        { text: "OK", onPress: () => router.push("/(tabs)") }
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
        setShowDatePicker(false);
      } else {
        const currentDate = selectedDate;
        setShowDatePicker(Platform.OS === "ios");
        const newDate = new Date(date);
        newDate.setHours(startTime.getHours(), startTime.getMinutes());
        setDate(currentDate);
        setStartTime(currentDate);
        setEndTime(new Date(currentDate.getTime() + 1 * 60 * 60 * 1000));
      }
    }
  };

  const onChangeStartTime = (event: any, selectedTime: any) => {
    setShowStartTimePicker(false);

    if (selectedTime) {
      const currentTime = new Date();
      if (selectedTime < currentTime) {
        setStartTime(currentTime);
        setEndTime(new Date(currentTime.getTime() + 1 * 60 * 60 * 1000));
        alert("You cannot select a time in the past");
      } else {
        setStartTime(selectedTime);
        setEndTime(new Date(selectedTime.getTime() + 1 * 60 * 60 * 1000));
      }
    }
  };

  const formatDate = (date: any) => {
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const formatTime = (time: any) => {
    let hours = time.getHours();
    let minutes = time.getMinutes();
    const ampm = hours >= 12 ? "PM" : "AM";

    hours = hours % 12;
    hours = hours ? hours : 12;
    minutes = minutes < 10 ? "0" + minutes : minutes;

    return `${hours}:${minutes} ${ampm}`;
  };

  const now = new Date();
  const initialHour = String(now.getHours() % 12 || 12).padStart(2, "0"); // 12-hour format
  const initialMinute = String(now.getMinutes()).padStart(2, "0");
  const initialAmPm = now.getHours() >= 12 ? "PM" : "AM";

  const [hour, setHour] = useState(initialHour);
  const [minute, setMinute] = useState(initialMinute);
  const [ampm, setAmPm] = useState(initialAmPm);


  const handleTimeSelect = () => {
    const now = new Date();
    
    // Convert hour/minute to 24-hour format
    let hour24 = parseInt(hour, 10);
    if (ampm === "PM" && hour24 !== 12) hour24 += 12;
    if (ampm === "AM" && hour24 === 12) hour24 = 0;

    // Set time to today's date
    now.setHours(hour24);
    now.setMinutes(parseInt(minute, 10));
    now.setSeconds(0);
    now.setMilliseconds(0);

    // Convert to UTC ISO format
    const isoString = now.toISOString();

    const currentTime = new Date();
    const selectedTime = new Date(isoString);

    if (selectedTime < currentTime && date <= currentTime) {
      setStartTime(currentTime);
      setEndTime(new Date(currentTime.getTime() + 1 * 60 * 60 * 1000));
      alert("You cannot select a time in the past");
    } else {
      setStartTime(selectedTime);
      setEndTime(new Date(selectedTime.getTime() + 1 * 60 * 60 * 1000));
    }
    setShowStartTimePicker(false)
  };

  return (
    <ThemedView>
      {
        showStartTimePicker && Platform.OS === "ios" && (
                <View
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "auto",
          backgroundColor: "#00000095",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          zIndex: 100,
        }}
      >
        <View
  style={{
    width: "80%",
    height: 320, // Use a fixed value, not percentage
    backgroundColor: "rgba(255,255,255,0.96)",
    borderRadius: 10,
    marginBottom: 40,
    padding: 10,
    paddingTop: 18,
    flexDirection: "column",
    justifyContent: "space-between",
    alignItems: "center",
  }}
>
  <View
    style={{
      justifyContent: 'space-between',
      flexDirection: 'row',
      width: '100%',
      marginBottom: 16,
    }}
  >
    <Text style={{ fontSize: 18, fontWeight: '600', color: '#222' }}>Select Start Time</Text>
    <TouchableOpacity
      onPress={handleTimeSelect}
      style={{
        width: 70,
        paddingVertical: 6,
        backgroundColor: "#140099",
        borderRadius: 6,
        alignItems: "center",
      }}
    >
      <Text style={{
        color: "white",
        fontWeight: "800",
        fontSize: 14,
        paddingBottom: 2,
      }}>
        Done
      </Text>
    </TouchableOpacity>
  </View>
  <TimeSelector
    ampm={ampm}
    hour={hour}
    minute={minute}
    setAmPm={setAmPm}
    setHour={setHour}
    setMinute={setMinute}
  />
</View>
      </View>
        )
      }
      <Stack.Screen
        options={{
          headerTitle: "Book a session",
          headerBackButtonDisplayMode: "minimal",
          headerStyle: {
            backgroundColor: "#090E26",
          },
          headerTintColor: "#fff",
        }}
      />

      <ScrollView
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="on-drag"
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
                  onPress={handleDatePickerOpen}
                >
                  <Text style={styles.dateTimeLabel}>Date:</Text>
                  <Text style={styles.dateTimeValue}>{formatDate(date)}</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.dateTimePicker}
                  onPress={handleStartTimePickerOpen}
                >
                  <Text style={styles.dateTimeLabel}>Start Time:</Text>
                  <Text style={styles.dateTimeValue}>
                    {formatTime(startTime)}
                  </Text>
                </TouchableOpacity>

                <View style={styles.dateTimePicker}>
                  <Text style={styles.dateTimeLabel}>End Time:</Text>
                  <Text style={styles.dateTimeValue}>
                    {formatTime(endTime)} {"(+60min)"}
                  </Text>
                </View>
              </View>
            </DisplayBox>

            {showDatePicker && (
              <View
                style={{
                  backgroundColor:"transparent",
                  borderRadius: 10,
                  padding: 4,
                }}
              >
                <DateTimePicker
                  testID="datePicker"
                  value={date}
                  mode="date"
                  is24Hour={true}
                  display="default"
                  onChange={onChangeDate}
                  minimumDate={new Date()}
                  maximumDate={
                    new Date(new Date().setMonth(new Date().getMonth() + 3))
                  }
                  themeVariant={"light"}
                  {...(Platform.OS === "ios" && { textColor: "white" })}
                />
              </View>
            )}
            {showStartTimePicker && Platform.OS === "android" && (
              <View
                style={{
                  backgroundColor: "transparent",
                  borderRadius: 10,
                  padding: 4,
                  position: "relative",
                }}
              >

                <DateTimePicker
                  testID="startTimePicker"
                  value={startTime}
                  mode="time"
                  is24Hour={false}
                  display="clock"
                  onChange={onChangeStartTime}
                  minimumDate={today}
                  // themeVariant={"light"}
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
                  {/* <Text style={styles.charge}>₹{type.charge}/hr</Text> */}
                  <Text style={styles.text}>{type.title}</Text>
                  <Text style={styles.subTxt}>{type.subTitle}</Text>
                </TouchableOpacity>
              ))}
            </DisplayBox>

            {/* <CustomDropdown data={trainers} onSelect={(value: string) => setSelectedTrainer(value)} /> */}

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
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  contentContainer: {
    height: "100%",
    paddingBottom: 100,
  },
  container: {
    justifyContent: "center",
    alignItems: "flex-start",
    height: "auto",
    position: "relative",
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
  selectedBox: {
    backgroundColor: "#3082fc30",
    borderColor: "#3082fc",
    borderWidth: 2,
  },
  charge: {
    color: "#1277fc",
    fontSize: 16,
    fontWeight: "400",
    position: "absolute",
    right: 8,
    top: 10,
  },
  subTxt: {
    color: "gray",
    fontSize: 14,
  },
  button: {
    width: "100%",
    paddingVertical: 15,
    paddingHorizontal: 10,
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
});
