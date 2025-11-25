import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    ScrollView,
    Alert,
    Platform,
    ActivityIndicator,
    Modal
} from "react-native";
import React, { useState } from "react";
import { Stack, useRouter, useLocalSearchParams } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import DateTimePicker, { DateTimePickerEvent } from "@react-native-community/datetimepicker";
import { ThemedView } from "@/components/ThemedView";
import { createSchedule } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";

// ---------- Types ----------
interface User {
    _id: string;
}

interface SessionType {
    title: string;
    subTitle: string;
    charge: number;
    value: string;
}

const DisplayBox = ({ title, children, long = false }: { title: string; children: React.ReactNode; long?: boolean; }) => (
    <View style={styles.box}>
        <Text style={styles.text}>{title}</Text>
        <View style={long ? styles.col : styles.row}>{children}</View>
    </View>
);

export default function Session() {
    const router = useRouter();
    const { user } = useAuth() as { user: User | null };

    // Get the trainerId passed from the home screen
    const params = useLocalSearchParams();
    const { trainerId } = params;

    const sessionTypes: SessionType[] = [
        { title: "Personal Training", subTitle: "1-on-1 session", charge: 799, value: "personal" },
        { title: "Group Training", subTitle: "Up to 5 people", charge: 199, value: "group" },
    ];

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // --- Component State ---
    const [date, setDate] = useState(new Date());
    const [startTime, setStartTime] = useState(new Date());
    const [sessionType, setSessionType] = useState(sessionTypes[0].value);
    const [loading, setLoading] = useState(false);

    // --- State for the custom picker modal ---
    const [isPickerVisible, setIsPickerVisible] = useState(false);
    const [pickerMode, setPickerMode] = useState<'date' | 'time'>('date');
    const [tempDate, setTempDate] = useState(new Date());

    if (!user) return <ActivityIndicator style={{ flex: 1, backgroundColor: '#090E26' }} size="large" color="#fff" />;

    // --- Handlers for opening the picker ---
    const openDatePicker = () => {
        setTempDate(date);
        setPickerMode('date');
        setIsPickerVisible(true);
    };

    const openTimePicker = () => {
        setTempDate(startTime);
        setPickerMode('time');
        setIsPickerVisible(true);
    };

    // --- Handler for iOS Picker Change (Internal State) ---
    const onIOSPickerChange = (event: DateTimePickerEvent, selectedDate?: Date) => {
        if (selectedDate) {
            setTempDate(selectedDate);
        }
    };

    // --- Handler for Android Native Picker ---
    const onAndroidPickerChange = (event: DateTimePickerEvent, selectedDate?: Date) => {
        // On Android, we close the picker immediately
        setIsPickerVisible(false);

        if (event.type === 'set' && selectedDate) {
            if (pickerMode === 'date') {
                // Validate Date
                if (selectedDate < today) {
                    Alert.alert("Invalid Date", "You cannot select a date in the past.");
                    return;
                }
                setDate(selectedDate);
                
                // Sync the date part of startTime
                const newStartTime = new Date(startTime);
                newStartTime.setFullYear(selectedDate.getFullYear(), selectedDate.getMonth(), selectedDate.getDate());
                
                if (newStartTime < new Date()) {
                    setStartTime(newStartTime);
                    Alert.alert("Time Update", "The date changed, so the time was updated. Please check if the time is correct.");
                } else {
                    setStartTime(newStartTime);
                }
            } else {
                // Handle Time Selection
                const proposedStartTime = new Date(date);
                proposedStartTime.setHours(selectedDate.getHours());
                proposedStartTime.setMinutes(selectedDate.getMinutes());
                proposedStartTime.setSeconds(0, 0);

                if (proposedStartTime < new Date()) {
                    Alert.alert("Invalid Time", "You cannot select a time in the past.");
                    return;
                }
                setStartTime(proposedStartTime);
            }
        }
    };

    // --- Handler for iOS "Confirm" button ---
    const onIOSConfirm = () => {
        if (pickerMode === 'date') {
            const selectedDate = tempDate;
            if (selectedDate < today) {
                Alert.alert("Invalid Date", "You cannot select a date in the past.");
                return;
            }
            setDate(selectedDate);

            const newStartTime = new Date(startTime);
            newStartTime.setFullYear(selectedDate.getFullYear(), selectedDate.getMonth(), selectedDate.getDate());

            if (newStartTime < new Date()) {
                setStartTime(newStartTime);
                Alert.alert("Time in Past", "The selected time is in the past for this date. Please select a new time.");
            } else {
                setStartTime(newStartTime);
            }
            setIsPickerVisible(false);

        } else { // time
            const selectedTime = tempDate;
            const proposedStartTime = new Date(date);
            proposedStartTime.setHours(selectedTime.getHours());
            proposedStartTime.setMinutes(selectedTime.getMinutes());
            proposedStartTime.setSeconds(0, 0);

            if (proposedStartTime < new Date()) {
                Alert.alert("Invalid Time", "You cannot select a time in the past for the chosen date.");
                return;
            }
            setStartTime(proposedStartTime);
            setIsPickerVisible(false);
        }
    };

    const handleSubmit = async () => {
        if (!trainerId) {
            Alert.alert("Error", "Trainer ID is missing. Please go back and try again.");
            return;
        }

        try {
            setLoading(true);
            const selectedSession = sessionTypes.find(s => s.value === sessionType);

            const payload = {
                date: date.toISOString(),
                startTime: startTime.toISOString(),
                endTime: new Date(startTime.getTime() + 3600000).toISOString(),
                scheduleSubject: "Training Session",
                scheduleDescription: `A ${selectedSession?.title || 'training'} session booking.`,
                sessionType: sessionType,
                trainerId: trainerId,
            };

            await createSchedule(payload);

            Alert.alert("Success", "Your session request has been sent!", [
                { text: "OK", onPress: () => router.push("/(tabs)") },
            ]);
        } catch (error: any) {
            const errorMessage = error.response?.data?.error || "Failed to send your request. Please try again.";
            console.error("Failed to schedule session:", error);
            Alert.alert("Error", errorMessage);
        } finally {
            setLoading(false);
        }
    };

    const formatDate = (d: Date) => d.toLocaleDateString("en-GB");
    const formatTime = (t: Date) => t.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: true });

    return (
        <ThemedView style={{ flex: 1 }}>
            <Stack.Screen options={{ headerShown: false }} />

            <SafeAreaView style={styles.headerContainer}>
                <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
                    <Ionicons name="chevron-back" size={26} color="#fff" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Book a session</Text>
            </SafeAreaView>

            <ScrollView showsVerticalScrollIndicator={false}>
                <View style={styles.pageContent}>
                    <Text style={styles.heading}>Book Training Session</Text>

                    <DisplayBox title="Schedule" long>
                        <TouchableOpacity style={styles.dateTimePicker} onPress={openDatePicker}>
                            <Text style={styles.dateTimeLabel}>Date:</Text>
                            <Text style={styles.dateTimeValue}>{formatDate(date)}</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.dateTimePicker} onPress={openTimePicker}>
                            <Text style={styles.dateTimeLabel}>Start Time:</Text>
                            <Text style={styles.dateTimeValue}>{formatTime(startTime)}</Text>
                        </TouchableOpacity>
                        <View style={styles.dateTimePicker}>
                            <Text style={styles.dateTimeLabel}>End Time:</Text>
                            <Text style={styles.dateTimeValue}>{formatTime(new Date(startTime.getTime() + 3600000))} (+60min)</Text>
                        </View>
                    </DisplayBox>

                    <DisplayBox title="Session Type" long>
                        {sessionTypes.map((type) => (
                            <TouchableOpacity
                                key={type.value}
                                style={[styles.longBox, sessionType === type.value && styles.selectedBox]}
                                onPress={() => setSessionType(type.value)}
                            >
                                <Text style={styles.text}>{type.title}</Text>
                                <Text style={styles.subTxt}>{type.subTitle}</Text>
                            </TouchableOpacity>
                        ))}
                    </DisplayBox>

                    <LinearGradient colors={["#08027a", "#382eff"]} style={styles.button}>
                        <TouchableOpacity onPress={handleSubmit} disabled={loading} style={{ width: "100%", alignItems: "center" }}>
                            {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.btnText}>Send Request</Text>}
                        </TouchableOpacity>
                    </LinearGradient>
                </View>
            </ScrollView>

            {/* ----- IOS PICKER (Modal) ----- */}
            {Platform.OS === 'ios' && (
                <Modal
                    transparent={true}
                    visible={isPickerVisible}
                    animationType="fade"
                    onRequestClose={() => setIsPickerVisible(false)}
                >
                    <TouchableOpacity style={styles.modalBackdrop} activeOpacity={1} onPress={() => setIsPickerVisible(false)}>
                        <View style={styles.modalCard}>
                            <Text style={styles.modalTitle}>{pickerMode === 'date' ? 'Select Date' : 'Select Time'}</Text>
                            <DateTimePicker
                                value={tempDate}
                                mode={pickerMode}
                                display="spinner"
                                onChange={onIOSPickerChange}
                                textColor="#fff"
                                minimumDate={today}
                            />
                            <TouchableOpacity style={styles.confirmButton} onPress={onIOSConfirm}>
                                <Text style={styles.confirmButtonText}>Confirm</Text>
                            </TouchableOpacity>
                        </View>
                    </TouchableOpacity>
                </Modal>
            )}

            {/* ----- ANDROID PICKER (Native Dialog) ----- */}
            {Platform.OS === 'android' && isPickerVisible && (
                <DateTimePicker
                    value={pickerMode === 'date' ? date : startTime}
                    mode={pickerMode}
                    display="default"
                    onChange={onAndroidPickerChange}
                    minimumDate={today}
                />
            )}
        </ThemedView>
    );
}

// ---------- Styles ----------
const styles = StyleSheet.create({
    headerContainer: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#090E26",
        paddingHorizontal: 20,
        paddingVertical: -30,
        borderBottomWidth: 1,
        borderBottomColor: '#1B2236'
    },
    backBtn: {
        width: 40,
        height: 40,
        borderRadius: 20,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#141A35",
        borderWidth: 1,
        borderColor: "#306BFF",
    },
    headerTitle: {
        flex: 1,
        textAlign: "center",
        color: "#fff",
        fontSize: 18,
        fontWeight: "700",
        marginRight: 40,
    },
    pageContent: {
        paddingHorizontal: 20,
        paddingTop: 8,
        paddingBottom: 40,
        gap: 15
    },
    heading: {
        fontSize: 24,
        fontWeight: "800",
        color: "white",
        marginBottom: 5
    },
    box: {
        padding: 14,
        backgroundColor: "#1B2236",
        borderWidth: 1,
        borderColor: "#3082fc",
        borderRadius: 12,
        gap: 12,
    },
    text: { color: "white", fontWeight: "700", fontSize: 16 },
    subTxt: { color: "gray", fontSize: 13 },
    col: { gap: 12 },
    row: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
    longBox: {
        padding: 16,
        borderWidth: 1,
        borderColor: "#3082fc",
        borderRadius: 8,
    },
    selectedBox: {
        backgroundColor: "rgba(48,130,252,0.2)",
        borderColor: "#3082fc",
        borderWidth: 2,
    },
    dateTimePicker: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: 'center',
        padding: 12,
        borderWidth: 1,
        borderColor: "#3082fc",
        borderRadius: 8,
    },
    dateTimeLabel: { color: "white", fontSize: 15 },
    dateTimeValue: { fontWeight: "700", color: "white", fontSize: 15 },
    button: { width: "100%", paddingVertical: 16, borderRadius: 10, marginTop: 10 },
    btnText: { color: "white", fontWeight: "700", fontSize: 18, textAlign: 'center' },

    // Modal Styles
    modalBackdrop: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.6)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalCard: {
        width: '90%',
        backgroundColor: '#1B2236',
        borderRadius: 14,
        padding: 20,
        alignItems: 'center',
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#fff',
        marginBottom: 20,
    },
    confirmButton: {
        backgroundColor: '#306BFF',
        borderRadius: 8,
        paddingVertical: 12,
        paddingHorizontal: 30,
        marginTop: 20,
    },
    confirmButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
});
