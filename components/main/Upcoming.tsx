import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Linking,
} from "react-native";
import React, { useEffect, useState } from "react";
import { LinearGradient } from "expo-linear-gradient";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { format } from "date-fns";

interface Schedule {
  id: string;
  date: string;
  startTime: string;
  scheduleLink: string;
  scheduleSubject: string;
  status: string;
  trainer: {
    name: string;
  };
}

export default function Upcoming() {
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUpcomingSchedules();
  }, []);

  const fetchUpcomingSchedules = async () => {
    try {
      const token = await AsyncStorage.getItem("userToken");
      const response = await axios.get(
        "https://fitness-admin-tau.vercel.app/api/mobile/schedule/upcoming",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      console.log(response.data.schedules);
      setSchedules(response.data.schedules);
    } catch (error) {
      console.error("Error fetching upcoming schedules:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={css.loadingContainer}>
        <ActivityIndicator size="large" color="#382eff" />
      </View>
    );
  }
  const handlePress = async (url: string) => {
    const supported = await Linking.canOpenURL(url);
    if (supported) {
      await Linking.openURL(url);
    } else {
      console.error("Cannot open URL:", url);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return format(date, "MMM d");
  }
  const formatTimeWithAMPM = (isoTimeString: string) => {
    const timeStr = isoTimeString.split("T")[1].split(":").slice(0, 2).join(":");
    const hour = parseInt(timeStr.split(":")[0]);
    const minute = timeStr.split(":")[1];
    
    // Convert to 12-hour format
    const hour12 = hour % 12 || 12;
    const ampm = hour >= 12 ? 'PM' : 'AM';
    
    return `${hour12}:${minute} ${ampm}`;
  };

  return (
    <View style={css.container}>
      <Text style={css.heading}>Upcoming</Text>

      {schedules.length > 0 ? (
        schedules.map((schedule) => (
          <View style={css.box} key={schedule.id}>
            <Text style={css.text}>
              {formatDate(schedule.date.split("T")[0])}{", "}
              {formatTimeWithAMPM(schedule.startTime)}
              {/* {formatTime(schedule.startTime.split("T")[1].split(":").slice(0, 2).join(":"))} */}
            </Text>
            <Text style={css.title}>{schedule.scheduleSubject}</Text>
            {schedule.status !== "requested" && (
              <Text style={css.trainerName}>With {schedule.trainer.name}</Text>
            )}
            <Text style={css.status}>Status - {schedule.status.toUpperCase()}</Text>
            {schedule.status === "requested" && (
              <LinearGradient
                colors={
                  schedule.status === "requested"
                    ? ["#08027a", "#382eff"]
                    : ["#08027a90", "#382eff90"]
                }
                start={{ x: 1, y: 0.9 }}
                end={{ x: 0.3, y: 0.8 }}
                style={css.button}
              >
                <TouchableOpacity>
                  <Text
                    style={[
                      css.btnText,
                      schedule.status === "requested" && { color: "#ffffff60" },
                    ]}
                  >
                    Waiting for Approval
                  </Text>
                </TouchableOpacity>
              </LinearGradient>
            )}

            {schedule.status === "pending" && (
              <LinearGradient
                colors={["#08027a", "#382eff"]}
                start={{ x: 1, y: 0.9 }}
                end={{ x: 0.3, y: 0.8 }}
                style={css.button}
              >
                <TouchableOpacity
                  onPress={() => handlePress(schedule.scheduleLink)}
                >
                  <Text
                    style={[
                      css.btnText,
                    ]}
                  >
                    Join Now
                  </Text>
                </TouchableOpacity>
              </LinearGradient>
            )}
          </View>
        ))
      ) : (
        <Text style={css.noSchedules}>No upcoming schedules</Text>
      )}
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
    left: 10,
    top: 12,
    fontSize: 18,
    fontWeight: "400",
    color: "white",
  },
  title: {
    color: "white",
    fontSize: 24,
    paddingTop: 40,
    fontWeight: "800",
  },
  trainerName: {
    color: "gray",
    marginTop: 4,
    fontSize: 16,
    fontWeight: "600",
  },
  status: {
    color: "#a1a1a1",
    marginTop: 4,
    fontSize: 14,
    fontWeight: "500",
  },
  button: {
    position: "absolute",
    bottom: 10,
    left: 10,
    width: "100%",
    paddingVertical: 10,
    paddingHorizontal: 10,
    textAlign: "center",
    borderRadius: 8,
  },
  btnText: {
    textAlign: "center",
    color: "white",
    fontWeight: "600",
    fontSize: 18,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  noSchedules: {
    color: "white",
    fontSize: 18,
    textAlign: "center",
    marginTop: 20,
  },
});
