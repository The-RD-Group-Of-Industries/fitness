import React, { useEffect, useState } from 'react';
import { 
  View, 
  Text, 
  FlatList, 
  TouchableOpacity, 
  Image, 
  StyleSheet, 
  ActivityIndicator, 
  SafeAreaView,
  Platform,
  StatusBar
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { apiClient } from '@/lib/api';
import { useAuth } from '@/context/AuthContext';

interface ChatPreview {
  id: string;
  trainer: {
    name: string;
    image: string | null;
  };
  messages: {
    content: string;
    createdAt: string;
  }[];
}

export default function ChatListScreen() {
  const [chats, setChats] = useState<ChatPreview[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const { user } = useAuth();

  useEffect(() => {
    fetchChats();
  }, []);

  const fetchChats = async () => {
    try {
      const res = await apiClient.get('/api/mobile/chat');
      setChats(res.data.chats || []);
    } catch (error) {
      console.error("Error fetching chats:", error);
    } finally {
      setLoading(false);
    }
  };

  const openChat = (chatId: string, trainerName: string) => {
    router.push({
      pathname: "/chat/[id]",
      params: { id: chatId, name: trainerName }
    });
  };

  const renderItem = ({ item }: { item: ChatPreview }) => {
    const lastMessage = item.messages[0]?.content || "No messages yet";
    const displayName = item.trainer?.name || "Trainer";
    const displayImage = item.trainer?.image 
      ? { uri: item.trainer.image } 
      : { uri: "https://ui-avatars.com/api/?name=Trainer&background=random" };

    return (
      <TouchableOpacity 
        style={styles.chatItem} 
        activeOpacity={0.7}
        onPress={() => openChat(item.id, displayName)}
      >
        <Image source={displayImage} style={styles.avatar} />
        <View style={styles.content}>
          <View style={styles.rowBetween}>
             <Text style={styles.name}>{displayName}</Text>
          </View>
          <Text style={styles.message} numberOfLines={1}>{lastMessage}</Text>
        </View>
      </TouchableOpacity>
    );
  };

  if (loading) return <View style={styles.center}><ActivityIndicator size="large" color="#FFFFFF" /></View>;

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor="#070F2B" />
      
      <View style={styles.container}>
        {/* Header Section */}
        <View style={styles.headerContainer}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color="white" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Messages</Text>
          <View style={{ width: 24 }} />
        </View>

        {chats.length === 0 ? (
          <View style={styles.center}>
            <Ionicons name="chatbubbles-outline" size={60} color="#2D364F" />
            <Text style={styles.emptyText}>No active chats yet.</Text>
            <Text style={styles.subEmptyText}>Start a conversation from a trainer's profile.</Text>
          </View>
        ) : (
          <FlatList
            data={chats}
            renderItem={renderItem}
            keyExtractor={item => item.id}
            contentContainerStyle={{ paddingBottom: 20 }}
            showsVerticalScrollIndicator={false}
          />
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#070F2B',
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
  container: {
    flex: 1,
    paddingHorizontal: 20,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#070F2B'
  },
  
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
    marginTop: 10,
  },
  backButton: {
    padding: 8,
    marginLeft: -8,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
  },

  chatItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    backgroundColor: '#1B2236',
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#233055',
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 15,
    backgroundColor: '#2D364F',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
  },
  rowBetween: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  name: {
    color: 'white',
    fontSize: 16,
    fontWeight: '700',
  },
  message: {
    color: '#A0AEC0',
    fontSize: 14,
  },
  emptyText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 16,
  },
  subEmptyText: {
    color: '#718096',
    fontSize: 14,
    marginTop: 8,
  }
});
