import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert, Platform } from "react-native"
import type React from "react"
import { useEffect, useState } from "react"
import { Stack } from "expo-router"
import CustomDropdown from "@/components/ui/DropDown"
import { LinearGradient } from "expo-linear-gradient"
import DateTimePicker, { type DateTimePickerEvent } from "@react-native-community/datetimepicker"
import axios from "axios"
import AsyncStorage from "@react-native-async-storage/async-storage"
import { useRouter } from "expo-router"

interface Trainer {
  id: string
  name: string | null
  email: string
}

interface DropdownItem {
  label: string
  value: string
}

const DisplayBox = ({
  title,
  children,
  long = false,
}: {
  title: string
  children: React.ReactNode
  long?: boolean
}) => (
  <View style={styles.box}>
    <Text style={styles.text}>{title}</Text>
    <View style={long ? styles.col : styles.row}>{children}</View>
  </View>
)

export default function Session() {
  const [trainers, setTrainers] = useState<DropdownItem[]>([])
  const [selectedTrainer, setSelectedTrainer] = useState("")
  const [date, setDate] = useState(new Date())
  const [startTime, setStartTime] = useState(new Date())
  const [endTime, setEndTime] = useState(new Date())
  const [sessionType, setSessionType] = useState("")
  const [loading, setLoading] = useState(false)
  const [showDatePicker, setShowDatePicker] = useState(false)
  const [showStartTimePicker, setShowStartTimePicker] = useState(false)
  const [showEndTimePicker, setShowEndTimePicker] = useState(false)
  const router = useRouter()

  useEffect(() => {
    fetchTrainers()
  }, [])

  const fetchTrainers = async () => {
    try {
      const response = await axios.get<{ users: Trainer[] }>("https://fitness-evolution-kohl.vercel.app/api/mobile/users/trainer")
      const formattedTrainers: DropdownItem[] = response.data.users.map((trainer: Trainer) => ({
        label: trainer.name || trainer.email,
        value: trainer.id,
      }))
      setTrainers(formattedTrainers)
    } catch (error) {
      console.error("Error fetching trainers:", error)
      Alert.alert("Error", "Failed to fetch trainers")
    }
  }

  const handleSubmit = async () => {
    if (!selectedTrainer || !sessionType) {
      Alert.alert("Error", "Please select a trainer and session type")
      return
    }

    try {
      setLoading(true)
      const token = await AsyncStorage.getItem("userToken")
      await axios.post(
        "https://fitness-evolution-kohl.vercel.app/api/mobile/schedule/create",
        {
          date: date.toISOString(),
          startTime: startTime.toISOString(),
          endTime: endTime.toISOString(),
          scheduleSubject: "Training Session",
          trainerId: selectedTrainer,
          sessionType,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      )
      Alert.alert("Success", "Session scheduled successfully!", [
        {
          text: "OK",
          onPress: () => router.push("/(tabs)"),
        },
      ])
    } catch (error) {
      console.error("Error scheduling session:", error)
      Alert.alert("Error", "Failed to schedule session")
    } finally {
      setLoading(false)
    }
  }

  const sessionTypes = [
    {
      title: "Personal Training",
      subTitle: "1-on-1 session",
      charge: 299,
      value: "personal",
    },
    {
      title: "Group Training",
      subTitle: "Up to 5 people",
      charge: 199,
      value: "group",
    },
  ]

  const onChangeDate = (event: DateTimePickerEvent, selectedDate?: Date) => {
    const currentDate = selectedDate || date
    setShowDatePicker(Platform.OS === "ios")
    setDate(currentDate)
  }

  const onChangeStartTime = (event: DateTimePickerEvent, selectedDate?: Date) => {
    const selectedTime = selectedDate || startTime
    setShowStartTimePicker(Platform.OS === "ios")
    setStartTime(selectedTime)
  }

  const onChangeEndTime = (event: DateTimePickerEvent, selectedDate?: Date) => {
    const selectedTime = selectedDate || endTime
    setShowEndTimePicker(Platform.OS === "ios")
    setEndTime(selectedTime)
  }

  return (
    <>
      <Stack.Screen
        options={{
          headerTitle: "Book a session",
        }}
      />
      <ScrollView keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false} contentContainerStyle={styles.contentContainer}>
        <View style={styles.container}>
          <View style={styles.child}>
            <Text style={styles.heading}>Book Training Session</Text>

            <DisplayBox title="Schedule">
              <View style={styles.dateTimeContainer}>
                <TouchableOpacity style={styles.dateTimePicker} onPress={() => setShowDatePicker(true)}>
                  <Text style={styles.dateTimeLabel}>Date:</Text>
                  <Text style={styles.dateTimeValue}>{date.toLocaleDateString()}</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.dateTimePicker} onPress={() => setShowStartTimePicker(true)}>
                  <Text style={styles.dateTimeLabel}>Start Time:</Text>
                  <Text style={styles.dateTimeValue}>{startTime.toLocaleTimeString()}</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.dateTimePicker} onPress={() => setShowEndTimePicker(true)}>
                  <Text style={styles.dateTimeLabel}>End Time:</Text>
                  <Text style={styles.dateTimeValue}>{endTime.toLocaleTimeString()}</Text>
                </TouchableOpacity>
              </View>
            </DisplayBox>

            {showDatePicker && (
              <DateTimePicker
                testID="datePicker"
                value={date}
                mode="date"
                is24Hour={true}
                display="default"
                onChange={onChangeDate}
              />
            )}
            {showStartTimePicker && (
              <DateTimePicker
                testID="startTimePicker"
                value={startTime}
                mode="time"
                is24Hour={true}
                display="default"
                onChange={onChangeStartTime}
              />
            )}
            {showEndTimePicker && (
              <DateTimePicker
                testID="endTimePicker"
                value={endTime}
                mode="time"
                is24Hour={true}
                display="default"
                onChange={onChangeEndTime}
              />
            )}

            <DisplayBox title="Session Type" long>
              {sessionTypes.map((type, index) => (
                <TouchableOpacity
                  key={index}
                  style={[styles.longBox, sessionType === type.value && styles.selectedBox]}
                  onPress={() => setSessionType(type.value)}
                >
                  <Text style={styles.charge}>₹{type.charge}/hr</Text>
                  <Text style={styles.text}>{type.title}</Text>
                  <Text style={styles.subTxt}>{type.subTitle}</Text>
                </TouchableOpacity>
              ))}
            </DisplayBox>

            <CustomDropdown data={trainers} onSelect={(value: string) => setSelectedTrainer(value)} />

            <LinearGradient
              colors={["#08027a", "#382eff"]}
              start={{ x: 1, y: 0.9 }}
              end={{ x: 0.3, y: 0.8 }}
              style={styles.button}
            >
              <TouchableOpacity onPress={handleSubmit} disabled={loading}>
                <Text style={styles.btnText}>{loading ? "Scheduling..." : "Schedule Session"}</Text>
              </TouchableOpacity>
            </LinearGradient>
          </View>
        </View>
      </ScrollView>
    </>
  )
}

const styles = StyleSheet.create({
  contentContainer: {
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
    backgroundColor: "#3082fc20",
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
})