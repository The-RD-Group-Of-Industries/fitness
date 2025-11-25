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
import { FontAwesome, MaterialIcons } from '@expo/vector-icons';
import * as WebBrowser from "expo-web-browser";
import { useAuth } from '@/context/AuthContext';

// --- Interface ---
interface Schedule {
    id: string;
    startTime: string;
    scheduleLink: string | null;
    scheduleSubject: string;
    status: 'requested' | 'pending' | 'confirmed' | 'cancelled';
    trainer: {
        name: string | null;
    };
}

// --- Helper for Status Badge Color ---
const getStatusColor = (status: string) => {
    switch (status) {
        case 'confirmed': return '#27ae60'; // Green
        case 'pending': return '#f39c12';   // Orange
        case 'requested': return '#3498db'; // Blue
        case 'cancelled': return '#e74c3c'; // Red
        default: return '#95a5a6';          // Gray
    }
};

// --- Schedule Card Component with Join Button ---
const ScheduleCard = ({ item }: { item: Schedule }) => {

    const handlePress = async (url: string | null) => {
        if (!url) {
            alert(`This session is currently ${item.status}. The meeting link is not available yet.`);
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

    // Date Formatting
    const dateObj = new Date(item.startTime);
    const date = dateObj.toLocaleDateString('en-GB', { day: 'numeric', month: 'long' });
    const time = dateObj.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
    const formattedDateTime = `${date} at ${time}`;

    const isJoinable = !!item.scheduleLink;

    return (
        <View style={styles.card}>
            <View style={styles.iconContainer}>
                 {/* Calendar Icon */}
                 <FontAwesome 
                    name="calendar-check-o" 
                    size={28} 
                    color={isJoinable ? '#F1C40F' : '#5a647d'} 
                />
            </View>

            <View style={styles.detailsContainer}>
                <Text style={styles.cardTitle} numberOfLines={1}>{item.scheduleSubject}</Text>
                <View style={styles.row}>
                    <MaterialIcons name="access-time" size={14} color="#A0AEC0" />
                    <Text style={styles.cardText}>{formattedDateTime}</Text>
                </View>
                <View style={styles.row}>
                    <MaterialIcons name="person" size={14} color="#A0AEC0" />
                    <Text style={styles.cardText}>Trainer: {item.trainer.name || 'N/A'}</Text>
                </View>
                {/* --- Join Button --- */}
                {isJoinable && (
                    <TouchableOpacity 
                        style={styles.joinBtn} 
                        onPress={() => handlePress(item.scheduleLink)}
                        activeOpacity={0.8}
                    >
                        <Text style={styles.joinBtnText}>Join</Text>
                    </TouchableOpacity>
                )}
            </View>

            {/* Status Badge on Right */}
            <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status) + '20' }]}> 
                <Text style={[styles.statusText, { color: getStatusColor(item.status) }]}>
                    {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
                </Text>
            </View>
        </View>
    );
};

// --- Main Upcoming Component ---
export default function Upcoming() {
    const [schedules, setSchedules] = useState<Schedule[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const isFocused = useIsFocused(); 
    const { isAuthenticated } = useAuth();

    useEffect(() => {
    let interval: any;
    if (isAuthenticated && isFocused) {
    fetchSchedules();
    // Poll every 5 seconds for changes
    interval = setInterval(fetchSchedules, 5000);
    }
    return () => {
    if (interval) clearInterval(interval);
    };
    }, [isFocused, isAuthenticated]);

    const fetchSchedules = async () => {
        try {
            if (schedules.length === 0) setIsLoading(true);
            const response = await getUpcomingSchedules();
            const scheduleData = response.data.schedules || response.data || [];
            const sorted = Array.isArray(scheduleData) 
                ? scheduleData.sort((a: any, b: any) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime())
                : [];
            setSchedules(sorted);
        } catch (error) {
            console.error("Failed to fetch upcoming schedules:", error);
        } finally {
            setIsLoading(false);
        }
    };

    if (isLoading && schedules.length === 0) {
        return <ActivityIndicator color="#fff" style={{ marginVertical: 40  }} />;
    }

    if (schedules.length === 0) {
        return (
            <View style={styles.emptyContainer}>
                <Text style={styles.emptyText}>No upcoming sessions.</Text>
            </View>
        );
    }

    return (
        <FlatList
            data={schedules}
            renderItem={({ item }) => <ScheduleCard item={item} />}
            keyExtractor={(item) => item.id}
            contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 20 }}
            scrollEnabled={false}
        />
    );
}

const styles = StyleSheet.create({
    emptyContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 30,
        backgroundColor: '#1B2236',
        borderRadius: 12,
        marginHorizontal: 20,
        marginTop: 10,
        borderWidth: 1,
        borderColor: '#233055'
    },
    emptyText: {
        color: '#718096',
        fontSize: 15,
    },
    card: {
        backgroundColor: '#1B2236',
        borderRadius: 16,
        padding: 16,
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
        borderWidth: 1,
        borderColor: '#2D364F',
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 3,
    },
    iconContainer: {
        marginRight: 16,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#232D45',
        width: 48,
        height: 48,
        borderRadius: 12,
    },
    detailsContainer: {
        flex: 1,
        gap: 4,
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
    },
    cardTitle: {
        color: 'white',
        fontSize: 16,
        fontWeight: '700',
        marginBottom: 2,
    },
    cardText: {
        color: '#A0AEC0',
        fontSize: 13,
        fontWeight: '500',
    },
    // --- Join Button Styles ---
    joinBtn: {
        alignSelf: 'flex-start',
        marginTop: 10,
        backgroundColor: '#306BFF',
        borderRadius: 8,
        paddingVertical: 7,
        paddingHorizontal: 15,
        elevation: 2,
    },
    joinBtnText: {
        color: '#fff',
        fontWeight: '700',
        fontSize: 14,
        letterSpacing: 0.5,
    },
    statusBadge: {
        paddingVertical: 4,
        paddingHorizontal: 8,
        borderRadius: 6,
        marginLeft: 8,
        alignSelf: 'flex-start',
    },
    statusText: {
        fontSize: 11,
        fontWeight: '700',
        textTransform: 'uppercase',
    },
});
