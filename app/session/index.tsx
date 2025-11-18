import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    ScrollView,
    Alert,
    Platform,
    ActivityIndicator
} from "react-native";
import React, { useState } from "react";
import { Stack, useRouter } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import DateTimePicker from "@react-native-community/datetimepicker";
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
        {/* This is the key: 'long' prop determines vertical (col) or horizontal (row) layout */}
        <View style={long ? styles.col : styles.row}>{children}</View>
    </View>
);

export default function Session() {
    const router = useRouter();
    const { user } = useAuth() as { user: User | null };

    const sessionTypes: SessionType[] = [
        { title: "Personal Training", subTitle: "1-on-1 session", charge: 799, value: "personal" },
        { title: "Group Training", subTitle: "Up to 5 people", charge: 199, value: "group" },
    ];

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const [date, setDate] = useState(new Date());
    const [startTime, setStartTime] = useState(new Date());
    const [endTime, setEndTime] = useState(new Date(Date.now() + 3600000));
    const [sessionType, setSessionType] = useState(sessionTypes[0].value);
    const [loading, setLoading] = useState(false);
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [showStartTimePicker, setShowStartTimePicker] = useState(false);

    if (!user) return <ActivityIndicator style={{ flex: 1, backgroundColor: '#090E26' }} size="large" color="#fff" />;

    const handleSubmit = async () => {
        try {
            setLoading(true);
            await createSchedule({
                date: date.toISOString(),
                startTime: startTime.toISOString(),
                endTime: endTime.toISOString(),
                scheduleSubject: "Training Session",
                userId: user._id,
                trainerId: "691313d10c0dc1d3e60c8ba0",
            });

            Alert.alert("Success", "Session scheduled successfully!", [
                { text: "OK", onPress: () => router.push("/(tabs)") },
            ]);
        } catch {
            Alert.alert("Error", "Failed to schedule session. Try again.");
        } finally {
            setLoading(false);
        }
    };

    const formatDate = (d: Date) => d.toLocaleDateString("en-GB");
    const formatTime = (t: Date) =>
        t.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: true });

    return (
        <ThemedView style={{ flex: 1 }}>
            <Stack.Screen options={{ headerShown: false }} />

            {/* ---- Safe Header ---- */}
            <SafeAreaView style={styles.headerContainer}>
                <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
                    <Ionicons name="chevron-back" size={26} color="#fff" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Book a session</Text>
            </SafeAreaView>

            {/* ---- Page Content ---- */}
            <ScrollView showsVerticalScrollIndicator={false}>
                <View style={styles.pageContent}>
                    <Text style={styles.heading}>Book Training Session</Text>

                    {/* SCHEDULE - THE FIX IS HERE */}
                    <DisplayBox title="Schedule" long> {/* <-- ADDED THE 'long' PROP */}
                        <TouchableOpacity style={styles.dateTimePicker} onPress={() => setShowDatePicker(true)}>
                            <Text style={styles.dateTimeLabel}>Date:</Text>
                            <Text style={styles.dateTimeValue}>{formatDate(date)}</Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={styles.dateTimePicker} onPress={() => setShowStartTimePicker(true)}>
                            <Text style={styles.dateTimeLabel}>Start Time:</Text>
                            <Text style={styles.dateTimeValue}>{formatTime(startTime)}</Text>
                        </TouchableOpacity>

                        <View style={styles.dateTimePicker}>
                            <Text style={styles.dateTimeLabel}>End Time:</Text>
                            <Text style={styles.dateTimeValue}>{formatTime(endTime)} (+60min)</Text>
                        </View>
                    </DisplayBox>

                    {/* SESSION TYPE */}
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

                    {/* BUTTON */}
                    <LinearGradient colors={["#08027a", "#382eff"]} style={styles.button}>
                        <TouchableOpacity onPress={handleSubmit} disabled={loading} style={{ width: "100%", alignItems: "center" }}>
                            {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.btnText}>Schedule Session</Text>}
                        </TouchableOpacity>
                    </LinearGradient>
                </View>
            </ScrollView>

            {/* PICKERS */}
            {showDatePicker && <DateTimePicker mode="date" value={date} onChange={(e, d) => { setShowDatePicker(false); if (d) setDate(d); }} />}
            {showStartTimePicker && <DateTimePicker mode="time" value={startTime} onChange={(e, t) => { setShowStartTimePicker(false); if (t) setStartTime(t); }} />}
        </ThemedView>
    );
}

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
        marginRight: 44, // Offset for the back button to keep title centered
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
    col: { gap: 12 }, // This style is for vertical stacking
    row: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" }, // This style is for horizontal arrangement
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
        padding: 12,
        borderWidth: 1,
        borderColor: "#3082fc",
        borderRadius: 8,
    },
    dateTimeLabel: { color: "white", fontSize: 16 },
    dateTimeValue: { fontWeight: "700", color: "white", fontSize: 16 },
    button: { width: "100%", paddingVertical: 16, borderRadius: 10 },
    btnText: { color: "white", fontWeight: "700", fontSize: 18 },
});
