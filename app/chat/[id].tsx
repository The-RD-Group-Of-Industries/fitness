import React, { useState, useEffect, useRef } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  FlatList, 
  KeyboardAvoidingView, 
  Platform, 
  StyleSheet, 
  ActivityIndicator,
  StatusBar 
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { apiClient } from '@/lib/api';
import { useAuth } from '@/context/AuthContext';
import { Ionicons } from '@expo/vector-icons';

interface Message {
  id: string;
  content: string;
  sender: {
    id: string;
    name: string;
  };
  createdAt: string;
}

export default function ChatScreen() {
  const { id: chatId, name } = useLocalSearchParams<{ id: string, name: string }>();
  const { user } = useAuth();
  const router = useRouter();
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState("");
  const [loading, setLoading] = useState(true);
  const flatListRef = useRef<FlatList>(null);

  useEffect(() => {
    fetchMessages();
    const interval = setInterval(fetchMessages, 3000);
    return () => clearInterval(interval);
  }, [chatId]);

  const fetchMessages = async () => {
    try {
      const res = await apiClient.get(`/api/mobile/chat/${chatId}/messages`);
      setMessages(res.data.messages || []);
    } catch (error) {
      console.error("Error fetching messages:", error);
    } finally {
      setLoading(false);
    }
  };

  const sendMessage = async () => {
    if (!inputText.trim()) return;

    const tempContent = inputText;
    setInputText(""); 

    const tempMessage: Message = {
      id: Date.now().toString(),
      content: tempContent,
      sender: { id: user?.id || 'me', name: user?.fullName || 'Me' },
      createdAt: new Date().toISOString()
    };
    setMessages(prev => [...prev, tempMessage]);

    try {
      await apiClient.post(`/api/mobile/chat/${chatId}/messages`, {
        content: tempContent
      });
      fetchMessages();
    } catch (error) {
      console.error("Failed to send message:", error);
      alert("Failed to send message.");
    }
  };

  const renderItem = ({ item }: { item: Message }) => {
    const isMe = item.sender.id === user?.id;
    return (
      <View style={[styles.messageBubble, isMe ? styles.myMessage : styles.theirMessage]}>
        <Text style={styles.messageText}>{item.content}</Text>
        <Text style={styles.timeText}>
          {new Date(item.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </Text>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <StatusBar barStyle="light-content" backgroundColor="#070F2B" />
      
      {/* Custom Header */}
      <View style={styles.headerContainer}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
        <Text style={styles.headerTitle} numberOfLines={1}>{name || "Chat"}</Text>
        <View style={{ width: 24 }} />
      </View>

      <KeyboardAvoidingView 
        behavior={Platform.OS === "ios" ? "padding" : undefined} 
        style={styles.container}
        keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 0}
      >
        {loading ? (
          <View style={styles.center}>
             <ActivityIndicator size="large" color="#306BFF" />
          </View>
        ) : (
          <FlatList
            ref={flatListRef}
            data={messages}
            renderItem={renderItem}
            keyExtractor={item => item.id}
            contentContainerStyle={{ paddingHorizontal: 15, paddingBottom: 20, paddingTop: 10 }}
            onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
            onLayout={() => flatListRef.current?.scrollToEnd({ animated: true })}
          />
        )}

        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            value={inputText}
            onChangeText={setInputText}
            placeholder="Type a message..."
            placeholderTextColor="#888"
            multiline
          />
          <TouchableOpacity onPress={sendMessage} style={styles.sendButton}>
            <Ionicons name="send" size={20} color="white" />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#070F2B' },
  container: { flex: 1, backgroundColor: '#070F2B' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  
  // Header
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 15,
    paddingVertical: 15,
    backgroundColor: '#090E26',
    borderBottomWidth: 1,
    borderBottomColor: '#1B2236',
  },
  backButton: { padding: 5 },
  headerTitle: { fontSize: 18, fontWeight: 'bold', color: 'white', flex: 1, textAlign: 'center' },

  // Bubbles
  messageBubble: { maxWidth: '80%', padding: 12, borderRadius: 16, marginBottom: 10 },
  myMessage: { alignSelf: 'flex-end', backgroundColor: '#306BFF', borderBottomRightRadius: 4 },
  theirMessage: { alignSelf: 'flex-start', backgroundColor: '#1B2236', borderBottomLeftRadius: 4 },
  messageText: { color: 'white', fontSize: 16 },
  timeText: { color: '#ccc', fontSize: 10, alignSelf: 'flex-end', marginTop: 4 },

  // Input
  inputContainer: { 
    flexDirection: 'row', 
    padding: 18, 
    backgroundColor: '#1B2236', 
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#233055'
  },
  input: { 
    flex: 1, 
    backgroundColor: '#090E26', 
    color: 'white', 
    borderRadius: 20, 
    paddingHorizontal: 15, 
    paddingVertical: 10, 
    marginRight: 10,
    maxHeight: 100
  },
  sendButton: { 
    backgroundColor: '#306BFF', 
    width: 40, 
    height: 40, 
    borderRadius: 20, 
    justifyContent: 'center', 
    alignItems: 'center' 
  }
});
