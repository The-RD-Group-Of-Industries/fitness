import React, { useEffect, useState } from 'react';
import { 
    View, 
    Text, 
    StyleSheet, 
    FlatList, 
    ActivityIndicator, 
    TouchableOpacity,
    Linking
} from 'react-native';
import { getUpcomingSchedules } from '@/lib/api';
import { useIsFocused } from '@react-navigation/native';
import { FontAwesome } from '@expo/vector-icons';
import * as WebBrowser from "expo-web-browser";

// --- Correct Type Definition to include 'pending' ---
interface Schedule {
    id: string;
    startTime: string;
    scheduleLink: string | null;
    scheduleSubject: string;
    status: 'requested' | 'pending' | 'confirmed' | 'cancelled'; // Added 'pending'
    trainer: {
        name: string | null;
    };
}

// --- Re-styled Schedule Card ---
const ScheduleCard = ({ item }: { item: Schedule }) => {

    const handlePress = async (url: string | null) => {
        // Only attempt to open if a link exists
        if (!url) {
            alert("This session has not been approved yet. The meeting link is not available.");
            return;
        }

        try {
            const supported = await Linking.canOpenURL(url);
            if (supported) {
                await Linking.openURL(url);
            } else {
                await WebBrowser.openBrowserAsync(url);
            }
        } catch (error) {
            console.error("Failed to open link:", error);
            alert("Could not open the meeting link.");
        }
    };

    // Format the date and time exactly as in your screenshot
    const formattedDateTime = new Date(item.startTime).toLocaleDateString('en-GB', {
        day: 'numeric',
        month: 'long',
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
    }).replace(' at', ' at'); // Clean up formatting

    // A session is considered "joinable" if it has a link, regardless of status.
    const isJoinable = !!item.scheduleLink;

    return (
        <TouchableOpacity 
            style={styles.card} 
            onPress={() => handlePress(item.scheduleLink)}
            disabled={!isJoinable} // Disable button if there's no link
            activeOpacity={0.7}
        >
            <View style={styles.iconContainer}>
                 <FontAwesome 
                    name="calendar-check-o" 
                    size={24} 
                    color={isJoinable ? '#F1C40F' : '#6c757d'} // Yellow for joinable, gray otherwise
                />
            </View>
            <View style={styles.detailsContainer}>
                <Text style={styles.cardTitle}>{item.scheduleSubject}</Text>
                <Text style={styles.cardText}>{formattedDateTime}</Text>
                <Text style={styles.cardText}>Trainer: {item.trainer.name || 'N/A'}</Text>
            </View>
        </TouchableOpacity>
    );
};

// --- Main Upcoming Component ---
export default function Upcoming() {
    const [schedules, setSchedules] = useState<Schedule[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const isFocused = useIsFocused(); 

    useEffect(() => {
        if (isFocused) {
            const fetchSchedules = async () => {
                try {
                    !schedules.length && setIsLoading(true); // Only show full loader on first load
                    const response = await getUpcomingSchedules();
                    console.log("Backend Response for Upcoming Schedules:", JSON.stringify(response.data, null, 2));
                    // --- This now correctly handles the "pending" status from your backend ---
                    setSchedules(response.data.schedules || []);
                } catch (error) {
                    console.error("Failed to fetch upcoming schedules:", error);
                } finally {
                    setIsLoading(false);
                }
            };
            fetchSchedules();
        }
    }, [isFocused]);

    if (isLoading) {
        return <ActivityIndicator color="#fff" style={{ marginVertical: 40 }} />;
    }

    if (schedules.length === 0) {
        return (
            <View style={styles.emptyContainer}>
                <Text style={styles.emptyText}>No upcoming schedules</Text>
            </View>
        );
    }

    return (
        <FlatList
            data={schedules}
            renderItem={({ item }) => <ScheduleCard item={item} />}
            keyExtractor={(item) => item.id}
            contentContainerStyle={{ paddingHorizontal: 20 }}
            scrollEnabled={false}
        />
    );
}

// --- Stylesheet to match your new design ---
const styles = StyleSheet.create({
    emptyContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 40,
        paddingHorizontal: 20,
    },
    emptyText: {
        color: '#A0AEC0',
        fontSize: 16,
        textAlign: 'center',
    },
    card: {
        backgroundColor: '#1B2236',
        borderRadius: 12,
        padding: 18,
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 15,
        borderWidth: 1,
        borderColor: '#3246a8'
    },
    iconContainer: {
        marginRight: 15,
    },
    detailsContainer: {
        flex: 1,
        gap: 6
    },
    cardTitle: {
        color: 'white',
        fontSize: 18,
        fontWeight: 'bold',
    },
    cardText: {
        color: '#A0AEC0',
        fontSize: 15,
    },
});
