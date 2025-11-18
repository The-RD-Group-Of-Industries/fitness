import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    ActivityIndicator,
    TouchableOpacity,
    Image,
    SafeAreaView,
    ScrollView,
    Dimensions
} from 'react-native';
import { ThemedView } from '@/components/ThemedView';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'expo-router';
import { Ionicons, FontAwesome } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { getAllTrainers } from '@/lib/api';
import Upcoming from '@/components/main/Upcoming'; // Assuming this component exists

// --- Define the Trainer type ---
interface Trainer {
    _id: string;
    fullName: string;
    email: string;
    image?: string;
    specialization?: string;
}

// --- Responsive Calculations for Buttons ---
const { width: screenWidth } = Dimensions.get('window');
const boxWidth = (screenWidth * 0.9) / 2 - 8; // Calculated to fit with padding

export default function HomeScreen() {
    const router = useRouter();
    const { isAuthenticated, isLoading: isAuthLoading } = useAuth();
    const [trainers, setTrainers] = useState<Trainer[]>([]);
    const [isFetching, setIsFetching] = useState(true);

    // --- Data for the top action buttons ---
    const buttonData = [
        {
            title: "Chat",
            Icon: "wechat",
            background: {
                stop_1: "teal",
                stop_2: "seagreen",
            },
            onClick: () => router.push("/chats")
        },
        {
            title: "Book Session",
            Icon: "clock-o",
            background: {
                stop_1: "#9616f2",
                stop_2: "#42009e",
            },
            onClick: () => router.push("/session")
        },
    ];

    // --- Function to fetch trainer data ---
    const fetchTrainers = async () => {
        if (!isAuthenticated) return;
        try {
            setIsFetching(true);
            const response = await getAllTrainers();
            setTrainers(response.data);
        } catch (error) {
            console.error("Failed to fetch trainers:", error);
        } finally {
            setIsFetching(false);
        }
    };

    // --- Fetch trainers when component mounts or user is authenticated ---
    useEffect(() => {
        if (isAuthenticated) {
            fetchTrainers();
        } else if (!isAuthLoading) {
            setIsFetching(false);
        }
    }, [isAuthenticated, isAuthLoading]);

    const onTrainerPress = (id: string) => {
        router.push(`/trainer/${id}`);
    };

    // --- Renders a single trainer item in the list ---
    const renderTrainerItem = ({ item }: { item: Trainer }) => (
        <TouchableOpacity style={styles.card} onPress={() => onTrainerPress(item._id)}>
            <Image
                source={item.image ? { uri: item.image } : require('@/assets/images/default-profile.png')}
                style={styles.trainerImage}
            />
            <View style={styles.infoContainer}>
                <Text style={styles.name}>{item.fullName}</Text>
                {item.specialization && <Text style={styles.specialization}>{item.specialization}</Text>}
            </View>
            <Ionicons name="chevron-forward" size={24} color="#4A5568" />
        </TouchableOpacity>
    );

    return (
        <SafeAreaView style={styles.safeArea}>
            <ThemedView style={styles.container}>
                <ScrollView showsVerticalScrollIndicator={false}>
                    {/* --- Top Action Buttons --- */}
                    <View style={styles.buttonRow}>
                        {buttonData.map((item, index) => (
                            <TouchableOpacity onPress={item.onClick} key={index} activeOpacity={0.85}>
                                <LinearGradient
                                    colors={[item.background.stop_1, item.background.stop_2]}
                                    start={{ x: 1, y: 0 }}
                                    end={{ x: 0, y: 0.4 }}
                                    style={styles.box}
                                >
                                    <FontAwesome name={item.Icon as "wechat" | "clock-o"} size={36} color="white" />
                                    <Text style={styles.boxText}>{item.title}</Text>
                                </LinearGradient>
                            </TouchableOpacity>
                        ))}
                    </View>

                    {/* --- Trainer List Section --- */}
                    <View style={styles.listHeader}>
                        <Text style={styles.title}>Find Your Trainer</Text>
                        <Text style={styles.subtitle}>
                            Browse certified professionals to start your fitness journey.
                        </Text>
                    </View>

                    {isFetching ? (
                        <ActivityIndicator size="large" color="#4CAF50" style={{ marginTop: 20 }} />
                    ) : (
                        <FlatList
                            data={trainers}
                            keyExtractor={(item) => item._id}
                            renderItem={renderTrainerItem}
                            scrollEnabled={false} // Disable FlatList scrolling inside a ScrollView
                            ListEmptyComponent={
                                <View style={styles.centeredContainer}>
                                    <Ionicons name="people-outline" size={60} color="#4A5568" />
                                    <Text style={styles.emptyText}>No Trainers Available</Text>
                                </View>
                            }
                        />
                    )}

                </ScrollView>
            </ThemedView>
        </SafeAreaView>
    );
}

// --- Combined Stylesheet ---
const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: '#070F2B',
    },
    container: {
        flex: 1,
    },
    buttonRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        marginBottom: 30,
    },
    box: {
        width: boxWidth,
        height: boxWidth * 0.85,
        borderRadius: 14,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 4,
        elevation: 3,
    },
    boxText: {
        color: 'white',
        fontSize: 15,
        marginTop: 8,
        fontWeight: '600',
        textAlign: 'center',
    },
    listHeader: {
        paddingHorizontal: 20,
        marginBottom: 20,
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#FFFFFF',
    },
    subtitle: {
        fontSize: 16,
        color: '#A0AEC0',
        marginTop: 8,
    },
    card: {
        backgroundColor: '#1A202C',
        borderRadius: 12,
        padding: 15,
        marginHorizontal: 20,
        marginBottom: 15,
        flexDirection: 'row',
        alignItems: 'center',
    },
    trainerImage: {
        width: 60,
        height: 60,
        borderRadius: 30,
        marginRight: 15,
        borderWidth: 2,
        borderColor: '#4CAF50',
    },
    infoContainer: {
        flex: 1,
    },
    name: {
        color: '#FFFFFF',
        fontSize: 18,
        fontWeight: '600',
    },
    specialization: {
        color: '#A0AEC0',
        fontSize: 14,
        marginTop: 4,
    },
    centeredContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 40,
    },
    emptyText: {
        color: '#FFFFFF',
        fontSize: 18,
        fontWeight: '600',
        marginTop: 15,
    },
});
