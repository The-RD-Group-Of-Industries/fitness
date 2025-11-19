import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    ScrollView,
    Alert,
    Platform,
    ActivityIndicator,
    Modal // Import Modal
} from "react-native";
import React, { useState } from "react";
import { Stack, useRouter } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import DateTimePicker, { DateTimePickerEvent } from "@react-native-community/datetimepicker";
import { ThemedView } from "@/components/ThemedView";
import { createSchedule } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { useLocalSearchParams } from 'expo-router';

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
    
    // --- Handlers for opening the modal ---
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

    // --- Handler for when the picker value changes ---
    const onPickerChange = (event: DateTimePickerEvent, selectedDate?: Date) => {
        if (selectedDate) {
            setTempDate(selectedDate);
        }
    };
    
    // --- Handler for the "Confirm" button in the modal ---
// --- Handler for the "Confirm" button in the modal ---
const onPickerConfirm = () => {
    if (pickerMode === 'date') {
        const selectedDate = tempDate;
        // Validate the selected date
        if (selectedDate < today) {
            Alert.alert("Invalid Date", "You cannot select a date in the past.");
            return;
        }
        
        // Update the main date state
        setDate(selectedDate);

        // --- FIX ---
        // Also update the date portion of the startTime state to keep them in sync.
        const newStartTime = new Date(startTime);
        newStartTime.setFullYear(selectedDate.getFullYear(), selectedDate.getMonth(), selectedDate.getDate());

        // Final check to ensure the resulting time isn't in the past (e.g., if today's time is later)
        if (newStartTime < new Date()) {
            setStartTime(newStartTime); // Update the time so the user sees the change...
            Alert.alert("Time in Past", "The selected time is in the past for this date. Please select a new time.");
        } else {
            setStartTime(newStartTime);
        }

        setIsPickerVisible(false);

    } else { // pickerMode is 'time'
        const selectedTime = tempDate;

        // --- FIX ---
        // Create the full proposed date-time by combining the date from state with the time from the picker.
        const proposedStartTime = new Date(date); 
        proposedStartTime.setHours(selectedTime.getHours());
        proposedStartTime.setMinutes(selectedTime.getMinutes());
        proposedStartTime.setSeconds(0, 0);

        // Now, validate this complete date-time against the current moment.
        if (proposedStartTime < new Date()) {
            Alert.alert("Invalid Time", "You cannot select a time in the past for the chosen date.");
            return; // Validation failed, do not close the picker.
        }

        // If validation is successful, update the startTime state with the complete, correct date-time.
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

            // Find the full session type object to get its title for the description
            const selectedSession = sessionTypes.find(s => s.value === sessionType);

            // This new payload matches what the backend API needs
            const payload = {
                date: date.toISOString(),
                startTime: startTime.toISOString(),
                endTime: new Date(startTime.getTime() + 3600000).toISOString(),
                scheduleSubject: "Training Session", // This is a required field on the backend
                scheduleDescription: `A ${selectedSession?.title || 'training'} session booking.`,
                sessionType: sessionType,
                trainerId: trainerId, 
            };

            await createSchedule(payload);

            Alert.alert("Success", "Your session request has been sent!", [
                { text: "OK", onPress: () => router.push("/(tabs)") },
            ]);
        } catch (error:any) {
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

            {/* ---- Custom Picker Modal ---- */}
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
                            display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                            onChange={onPickerChange}
                            textColor={Platform.OS === 'ios' ? '#fff' : undefined}
                            minimumDate={today}
                        />
                        <TouchableOpacity style={styles.confirmButton} onPress={onPickerConfirm}>
                            <Text style={styles.confirmButtonText}>Confirm</Text>
                        </TouchableOpacity>
                    </View>
                </TouchableOpacity>
            </Modal>
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
    },
    backBtn: {
        width: 44,
        height: 44,
        borderRadius: 22,
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
        fontSize: 20,
        fontWeight: "700",
        marginRight: 44,
    },
    pageContent: { padding: 20, gap: 22 },
    heading: { fontSize: 27, fontWeight: "800", color: "white" },
    box: {
        padding: 14,
        backgroundColor: "#1B2236",
        borderWidth: 1,
        borderColor: "#3082fc",
        borderRadius: 12,
        gap: 12,
    },
    text: { color: "white", fontWeight: "700", fontSize: 18 },
    subTxt: { color: "gray", fontSize: 14 },
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
    dateTimeLabel: { color: "white", fontSize: 16 },
    dateTimeValue: { fontWeight: "700", color: "white", fontSize: 16 },
    button: { width: "100%", paddingVertical: 16, borderRadius: 10 },
    btnText: { color: "white", fontWeight: "700", fontSize: 18, textAlign: 'center' },
    
    // --- Styles for the new Modal ---
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
