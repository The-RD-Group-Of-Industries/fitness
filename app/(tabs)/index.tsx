import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    ScrollView,
    Dimensions,
    FlatList,
    ActivityIndicator,
    Image,
    Alert
} from 'react-native';
// 1. Import useSafeAreaInsets instead of SafeAreaView wrapper
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ThemedView } from '@/components/ThemedView';
import { useRouter } from 'expo-router';
import { FontAwesome } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { getAllTrainers, apiClient } from '@/lib/api'; 
import Upcoming from '@/components/main/Upcoming';
import { useAuth } from '@/context/AuthContext';

const { width: screenWidth } = Dimensions.get('window');
const boxWidth = (screenWidth * 0.9) / 2 - 8;

interface Trainer {
    id: string;
    name: string | null;
    specialization: string | null;
    image: string | null;
}

export default function HomeScreen() {
    const router = useRouter();
    const { isAuthenticated } = useAuth();
    // 2. Get safe area insets
    const insets = useSafeAreaInsets();
    
    const [trainers, setTrainers] = useState<Trainer[]>([]);
    const [featuredTrainerId, setFeaturedTrainerId] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isStartingChat, setIsStartingChat] = useState(false);

    useEffect(() => {
        if (isAuthenticated) {
            const fetchTrainers = async () => {
                try {
                    const response = await getAllTrainers();
                    const trainerList = response.data.users || [];
                    setTrainers(trainerList);
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
        }
    }, [isAuthenticated]);

    // ... (handleStartChat function remains the same)
    const handleStartChat = async (trainerId: string, trainerName: string) => {
        if (isStartingChat) return;
        setIsStartingChat(true);

        try {
            const response = await apiClient.post('/api/mobile/chat/create', {
                trainerId: trainerId
            });

            const chat = response.data.chat;

            if (chat && chat.id) {
                router.push({
                    pathname: "/chat/[id]",
                    params: { 
                        id: chat.id, 
                        name: trainerName || 'Trainer' 
                    }
                });
            } else {
                Alert.alert("Error", "Could not start chat session.");
            }
        } catch (error) {
            console.error("Start chat error:", error);
            Alert.alert("Error", "Failed to connect with trainer.");
        } finally {
            setIsStartingChat(false);
        }
    };

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
                    alert("Trainer information is not available yet.");
                }
            }
        },
        {
            title: "My Chats",
            Icon: "wechat",
            background: { stop_1: "teal", stop_2: "seagreen" },
            onClick: () => router.push("/chat")
        },
    ];

    const TrainerCard = ({ trainer }: { trainer: Trainer }) => (
        <TouchableOpacity 
            activeOpacity={0.9}
            style={styles.trainerCard}
            onPress={() => handleStartChat(trainer.id, trainer.name || 'Trainer')}
        >
            {trainer.image ? (
                <Image source={{ uri: trainer.image }} style={styles.trainerImage} />
            ) : (
                <View style={styles.trainerImagePlaceholder}>
                    <FontAwesome name="user" size={40} color="#555" />
                </View>
            )}
            <Text style={styles.trainerName} numberOfLines={1}>{trainer.name || 'Trainer'}</Text>
            <Text style={styles.trainerSpec} numberOfLines={1}>{trainer.specialization || 'Fitness'}</Text>
            
            <TouchableOpacity 
                style={styles.chatMiniBtn}
                onPress={() => handleStartChat(trainer.id, trainer.name || 'Trainer')}
            >
                <Text style={styles.chatMiniText}>Chat Now</Text>
            </TouchableOpacity>
        </TouchableOpacity>
    );

    const renderFeaturedTrainers = () => {
        if (isLoading) return <ActivityIndicator size="large" color="#fff" style={{ marginTop: 20 }} />;
        if (error) return <Text style={styles.errorText}>{error}</Text>;

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
        // 3. Replaced SafeAreaView with ThemedView and added manual top padding
        <ThemedView style={[styles.container, { paddingTop: insets.top }]}>
            <ScrollView 
                showsVerticalScrollIndicator={false}
                // 4. Added bottom padding to fix the cut-off issue
                contentContainerStyle={{ paddingBottom: 100 }}
            >
                {/* Header */}
                <View style={styles.header}>
                    <Text style={styles.title}>Welcome to Fitness Evolution</Text>
                    <Text style={styles.subtitle}>
                        Your personal guide to achieving your fitness goals. Book sessions and chat directly with your trainer.
                    </Text>
                </View>

                {/* Action Buttons */}
                <View style={styles.buttonRow}>
                    {buttonData.map((item, index) => (
                        <TouchableOpacity onPress={item.onClick} key={index} activeOpacity={0.85}>
                            <LinearGradient
                                colors={[item.background.stop_1, item.background.stop_2]}
                                start={{ x: 1, y: 0 }}
                                end={{ x: 0, y: 0.4 }}
                                style={styles.box}
                            >
                                <FontAwesome name={item.Icon as any} size={36} color="white" />
                                <Text style={styles.boxText}>{item.title}</Text>
                            </LinearGradient>
                        </TouchableOpacity>
                    ))}
                </View>

                {/* Featured Trainers */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Featured Trainers</Text>
                    {renderFeaturedTrainers()}
                </View>

                {/* Upcoming Sessions */}
                <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Upcoming</Text>
                        <Upcoming />
                </View>

            </ScrollView>
            
            {isStartingChat && (
                <View style={styles.loadingOverlay}>
                    <ActivityIndicator size="large" color="#fff" />
                </View>
            )}
        </ThemedView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#070F2B' },
    header: { paddingHorizontal: 20, paddingBottom: 30, paddingTop: 25 },
    title: { fontSize: 28, fontWeight: 'bold', color: '#FFFFFF', marginBottom: 8 },
    subtitle: { fontSize: 16, color: '#A0AEC0', lineHeight: 24 },
    buttonRow: { flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 20 },
    box: {
        width: boxWidth,
        height: boxWidth * 0.85,
        borderRadius: 14,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowOffset: { width: 0, height: 2 },
        elevation: 3,
    },
    boxText: { color: 'white', fontSize: 15, marginTop: 8, fontWeight: '600' },
    section: {},
    sectionTitle: { fontSize: 22, fontWeight: 'bold', color: 'white', marginBottom: 15, paddingHorizontal: 20, marginTop: 15 },
    
    trainerCard: {
        width: 140,
        height: 210,
        backgroundColor: '#1B2236',
        borderRadius: 12,
        marginRight: 15,
        alignItems: 'center',
        padding: 10,
        justifyContent: 'space-between'
    },
    trainerImage: { width: 80, height: 80, borderRadius: 40, marginBottom: 5 },
    trainerImagePlaceholder: { width: 80, height: 80, borderRadius: 40, backgroundColor: '#f0f0f0', justifyContent: 'center', alignItems: 'center', marginBottom: 5 },
    trainerName: { fontSize: 16, fontWeight: 'bold', color: '#FFFFFF', textAlign: 'center' },
    trainerSpec: { fontSize: 12, color: '#777', textAlign: 'center', marginBottom: 5 },
    
    chatMiniBtn: {
        backgroundColor: '#306BFF',
        paddingVertical: 6,
        paddingHorizontal: 12,
        borderRadius: 20,
        marginTop: 5,
        width: '100%',
        alignItems: 'center'
    },
    chatMiniText: { color: 'white', fontSize: 12, fontWeight: 'bold' },

    errorText: { color: 'red', textAlign: 'center', marginTop: 20 },
    loadingOverlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center',
        alignItems: 'center'
    }
});
