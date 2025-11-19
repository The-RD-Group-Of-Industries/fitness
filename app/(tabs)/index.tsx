import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    SafeAreaView,
    ScrollView,
    Dimensions,
    FlatList, // Import FlatList for the horizontal list
    ActivityIndicator, // To show while loading
    Image // To display trainer images
} from 'react-native';
import { ThemedView } from '@/components/ThemedView';
import { useRouter } from 'expo-router';
import { FontAwesome } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
// --- Make sure to import your API function ---
import { getAllTrainers } from '@/lib/api'; 
import Upcoming from '@/components/main/Upcoming';

// --- Responsive Calculations for Buttons ---
const { width: screenWidth } = Dimensions.get('window');
const boxWidth = (screenWidth * 0.9) / 2 - 8;

// --- Define a type for the trainer data ---
interface Trainer {
    id: string;
    name: string | null;
    specialization: string | null;
    image: string | null; // URL for the trainer's image
}

export default function HomeScreen() {
    const router = useRouter();

    // --- State for fetching trainers ---
    const [trainers, setTrainers] = useState<Trainer[]>([]);4
    // state for holding the trainer id
    const [featuredTrainerId, setFeaturedTrainerId] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // --- Fetch trainers when the component mounts ---
    useEffect(() => {
        const fetchTrainers = async () => {
            try {
                const response = await getAllTrainers();
                const trainerList = response.data.users || [];
                // Assuming the API returns an object with a 'users' array
                setTrainers(response.data.users || []); 
                if (trainerList.length > 0) {
                    setFeaturedTrainerId(trainerList[0].id);
                }
            } catch (err) {
                setError("Failed to load trainers.");
                console.error("Fetch trainers error:", err);
            } finally {
                setIsLoading(false);
            }
        };

        fetchTrainers();
    }, []);

    // --- Data for the top action buttons ---
    const buttonData = [
        {
            title: "Book Session",
            Icon: "clock-o",
            background: { stop_1: "#9616f2", stop_2: "#42009e" },
            onClick: () => {
                if (featuredTrainerId) {
                    router.push({
                        pathname: "/session",
                        params: { trainerId: featuredTrainerId }
                    });
                } else {
                    alert("Trainer information is not available yet. Please wait a moment and try again.");
                }
            }
        },
        {
            title: "Chat",
            Icon: "wechat",
            background: { stop_1: "teal", stop_2: "seagreen" },
            onClick: () => router.push("/chats")
        },
    ];

    // --- Component to render each trainer card ---
    const TrainerCard = ({ trainer }: { trainer: Trainer }) => (
        <View style={styles.trainerCard}>
            {trainer.image ? (
                <Image source={{ uri: trainer.image }} style={styles.trainerImage} />
            ) : (
                // Placeholder if no image is available
                <View style={styles.trainerImagePlaceholder}>
                    <FontAwesome name="user" size={40} color="#555" />
                </View>
            )}
            <Text style={styles.trainerName}>{trainer.name || 'Trainer'}</Text>
            <Text style={styles.trainerSpec}>{trainer.specialization || 'Fitness'}</Text>
        </View>
    );

    // --- Component to render the list of trainers ---
    const renderFeaturedTrainers = () => {
        if (isLoading) {
            return <ActivityIndicator size="large" color="#fff" style={{ marginTop: 20 }} />;
        }

        if (error) {
            return <Text style={styles.errorText}>{error}</Text>;
        }

        return (
            <FlatList
                data={trainers}
                renderItem={({ item }) => <TrainerCard trainer={item} />}
                keyExtractor={item => item.id}
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{ paddingLeft: 20, paddingRight: 10 }}
            />
        );
    };

    return (
        <SafeAreaView style={styles.safeArea}>
            <ThemedView style={styles.container}>
                <ScrollView showsVerticalScrollIndicator={false}>
                    {/* --- Informative Header Section --- */}
                    <View style={styles.header}>
                        <Text style={styles.title}>Welcome to Fitness Evolution</Text>
                        <Text style={styles.subtitle}>
                            Your personal guide to achieving your fitness goals. Book sessions and chat directly with your trainer, all in one place.
                        </Text>
                    </View>

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
                    
                    {/* --- NEW: Featured Trainer Section --- */}
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Featured Trainer</Text>
                        {renderFeaturedTrainers()}
                    </View>
                    
                    {/* --- Upcoming Section --- */}
                    {/* <View style={styles.section}>
                         <Text style={styles.sectionTitle}>Upcoming</Text>
                         <Upcoming />
                    </View> */}

                </ScrollView>
            </ThemedView>
        </SafeAreaView>
    );
}


// --- Stylesheet ---
const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: '#070F2B',
    },
    container: {
        flex: 1,
    },
    header: {
        paddingHorizontal: 20,
        paddingBottom: 30,
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#FFFFFF',
        marginBottom: 8,
    },
    subtitle: {
        fontSize: 16,
        color: '#A0AEC0',
        lineHeight: 24,
    },
    buttonRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
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
    // --- NEW STYLES ---
    section: {
        marginBottom: 30,
    },
    sectionTitle: {
        fontSize: 22,
        fontWeight: 'bold',
        color: 'white',
        marginBottom: 15,
        paddingHorizontal: 20,
        marginTop: 15,
    },
    trainerCard: {
        width: 140,
        height: 180,
        backgroundColor: '#fff',
        borderRadius: 12,
        marginRight: 15,
        alignItems: 'center',
        padding: 10,
    },
    trainerImage: {
        width: 90,
        height: 90,
        borderRadius: 45,
        marginBottom: 10,
    },
    trainerImagePlaceholder: {
        width: 90,
        height: 90,
        borderRadius: 45,
        backgroundColor: '#f0f0f0',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 10,
    },
    trainerName: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
    },
    trainerSpec: {
        fontSize: 14,
        color: '#777',
    },
    errorText: {
        color: 'red',
        textAlign: 'center',
        marginTop: 20,
    },
});
