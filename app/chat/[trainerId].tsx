import { View, Text, StyleSheet, TextInput, FlatList, TouchableOpacity, ActivityIndicator } from "react-native";
import { useEffect, useState, useRef, useLayoutEffect } from "react";
import { Stack, useLocalSearchParams } from "expo-router";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useNavigation } from "@react-navigation/native";

interface Message {
  id: string;
  content: string;
  createdAt: string;
  senderId: string;
  sender: {
    id: string;
    name: string;
    image: string;
  };
}

export default function ChatScreen() {
  const navigation = useNavigation();
  const { trainerId, name } = useLocalSearchParams<{ trainerId: string, name: string }>();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(true);
  const [chatId, setChatId] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  // const [userName, setUserName] = useState<string | null>("");
  const flatListRef = useRef<FlatList>(null);

  useEffect(() => {
    if (chatId) {
      const interval = setInterval(fetchMessages, 1000);
      return () => clearInterval(interval);
    }
  }, [chatId]);

  const getUserId = async () => {
    try {
      const token = await AsyncStorage.getItem("userToken");
      const response = await axios.get("https://fitness-admin-tau.vercel.app/api/mobile/user", {
        headers: { Authorization: `Bearer ${token}` },
      });
      // setUserName(response.data.user.name);
      setUserId(response.data.user.id);
    } catch (error) {
      console.error("Error getting user ID:", error);
    }
  };

  const initializeChat = async () => {
    try {
      const token = await AsyncStorage.getItem("userToken");
      const response = await axios.post(
        "https://fitness-admin-tau.vercel.app/api/mobile/chat/create",
        { trainerId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setChatId(response.data.chat.id);

      await fetchMessages(response.data.chat.id);
    } catch (error) {
      console.error("Error initializing chat:", error);
    } finally {
      setLoading(false);
    }
  };

  
  useEffect(() => {
    initializeChat();
    getUserId();
  }, [trainerId]);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: `${name}`, 
    });
  }, [name, navigation]);

  const fetchMessages = async (id?: string) => {
    try {
      const token = await AsyncStorage.getItem("userToken");
      const response = await axios.get(
        `https://fitness-admin-tau.vercel.app/api/mobile/chat/${id || chatId}/messages`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setMessages(response.data.messages);
    } catch (error) {
      console.error("Error fetching messages:", error);
    }
  };

  const sendMessage = async () => {
    if (!input.trim() || !chatId) return;

    try {
      const token = await AsyncStorage.getItem("userToken");
      await axios.post(
        `https://fitness-admin-tau.vercel.app/api/mobile/chat/${chatId}/messages`,
        { content: input },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setInput("");
      await fetchMessages();
      flatListRef.current?.scrollToEnd();
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#00B4D8" />
      </View>
    );
  }

  return (
    <>
      <Stack.Screen
        options={{
          headerStyle: {
            backgroundColor: "#090E21",
          },
          headerTintColor: "#fff",
        }}
      />
      <View style={styles.container}>
        <FlatList
          ref={flatListRef}
          data={messages}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View
              style={[
                styles.messageContainer,
                item.sender.id === userId ? styles.userMessage : styles.trainerMessage,
              ]}
            >
              <Text style={styles.messageText}>{item.content}</Text>
            </View>
          )}
          onContentSizeChange={() => flatListRef.current?.scrollToEnd()}
        />
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            value={input}
            onChangeText={setInput}
            placeholder="Type your message..."
            placeholderTextColor="#6B7280"
          />
          <TouchableOpacity onPress={sendMessage} style={styles.sendButton}>
            <LinearGradient
              colors={["#00B4D8", "#0077B6"]}
              style={styles.sendButtonGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              <Ionicons name="send" size={24} color="#fff" />
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#090E21",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#090E21",
  },
  messageContainer: {
    maxWidth: "80%",
    marginVertical: 4,
    marginHorizontal: 12,
    padding: 12,
    borderRadius: 16,
  },
  userMessage: {
    alignSelf: "flex-end",
    backgroundColor: "#00B4D8",
  },
  trainerMessage: {
    alignSelf: "flex-start",
    backgroundColor: "#1C2139",
  },
  messageText: {
    color: "#fff",
    fontSize: 16,
  },
  inputContainer: {
    flexDirection: "row",
    padding: 12,
    backgroundColor: "#1C2139",
    alignItems: "center",
  },
  input: {
    flex: 1,
    backgroundColor: "#090E21",
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 8,
    color: "#fff",
    fontSize: 16,
  },
  sendButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    overflow: "hidden",
  },
  sendButtonGradient: {
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
});
