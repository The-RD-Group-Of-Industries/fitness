import { View, Text, StyleSheet, TextInput, FlatList, TouchableOpacity, ActivityIndicator, Platform, Keyboard, Dimensions } from "react-native";
import { useEffect, useState, useRef, useLayoutEffect } from "react";
import { Stack, useLocalSearchParams } from "expo-router";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useNavigation } from "@react-navigation/native";
import { ThemedView } from "@/components/ThemedView";
import { useSafeAreaInsets } from 'react-native-safe-area-context';

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

const { height: screenHeight } = Dimensions.get('window');

export default function ChatScreen() {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const { trainerId, name } = useLocalSearchParams<{ trainerId: string, name: string }>();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(true);
  const [chatId, setChatId] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [keyboardHeight, setKeyboardHeight] = useState(0);
  const [isKeyboardVisible, setIsKeyboardVisible] = useState(false);
  const flatListRef = useRef<FlatList>(null);

  useEffect(() => {
    if (chatId) {
      const interval = setInterval(fetchMessages, 1000);
      return () => clearInterval(interval);
    }
  }, [chatId]);

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow',
      (event) => {
        setKeyboardHeight(event.endCoordinates.height);
        setIsKeyboardVisible(true);
        // Scroll to end when keyboard appears
        setTimeout(() => {
          flatListRef.current?.scrollToEnd({ animated: true });
        }, 100);
      }
    );

    const keyboardDidHideListener = Keyboard.addListener(
      Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide',
      () => {
        setKeyboardHeight(0);
        setIsKeyboardVisible(false);
      }
    );

    return () => {
      keyboardDidShowListener?.remove();
      keyboardDidHideListener?.remove();
    };
  }, []);

  const getUserId = async () => {
    try {
      const token = await AsyncStorage.getItem("userToken");
      const response = await axios.get("https://fitness-admin-tau.vercel.app/api/mobile/user", {
        headers: { Authorization: `Bearer ${token}` },
      });
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
      // Scroll to end after sending message
      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
      }, 100);
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  const scrollToEnd = () => {
    setTimeout(() => {
      flatListRef.current?.scrollToEnd({ animated: true });
    }, 100);
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#00B4D8" />
      </View>
    );
  }

  const inputContainerHeight = 80 + (Platform.OS === 'ios' ? insets.bottom : 16);
  const availableHeight = screenHeight - keyboardHeight - inputContainerHeight - (Platform.OS === 'ios' ? 100 : 80);

  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          headerBackButtonDisplayMode: "minimal",
          headerStyle: {
            backgroundColor: "#090E21",
          },
          headerTintColor: "#fff",
        }}
      />
      
      <View style={[
        styles.messagesContainer,
        {
          height: isKeyboardVisible ? availableHeight : undefined,
          marginBottom: isKeyboardVisible ? keyboardHeight : 0
        }
      ]}>
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
              <Text style={styles.messageTime}>
                {new Date(item.createdAt).toLocaleTimeString([], { 
                  hour: '2-digit', 
                  minute: '2-digit' 
                })}
              </Text>
            </View>
          )}
          contentContainerStyle={styles.messagesList}
          onContentSizeChange={scrollToEnd}
          showsVerticalScrollIndicator={false}
          maintainVisibleContentPosition={{
            minIndexForVisible: 0,
          }}
        />
      </View>

      <View style={[
        styles.inputContainer,
        {
          position: isKeyboardVisible ? 'absolute' : 'relative',
          bottom: isKeyboardVisible ? keyboardHeight : 0,
          left: 0,
          right: 0,
          paddingBottom: Platform.OS === 'ios' ? insets.bottom : 16,
        }
      ]}>
        <View style={styles.inputWrapper}>
          <TextInput
            style={styles.input}
            value={input}
            onChangeText={setInput}
            placeholder="Type a message..."
            placeholderTextColor="#6B7280"
            multiline
            maxLength={1000}
            onFocus={() => {
              setTimeout(() => {
                flatListRef.current?.scrollToEnd({ animated: true });
              }, 300);
            }}
            returnKeyType="send"
            onSubmitEditing={sendMessage}
            blurOnSubmit={false}
          />
          <TouchableOpacity 
            onPress={sendMessage} 
            style={styles.sendButton}
            disabled={!input.trim()}
          >
            <LinearGradient
              colors={input.trim() ? ["#00B4D8", "#0077B6"] : ["#6B7280", "#6B7280"]}
              style={styles.sendButtonGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              <Ionicons name="send" size={20} color="#fff" />
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#090E21",
  },
  messagesContainer: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#090E21",
  },
  messagesList: {
    paddingVertical: 8,
    paddingBottom: 20,
  },
  messageContainer: {
    maxWidth: "75%",
    marginVertical: 2,
    marginHorizontal: 12,
    padding: 12,
    borderRadius: 18,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  userMessage: {
    alignSelf: "flex-end",
    backgroundColor: "#00B4D8",
    borderBottomRightRadius: 4,
  },
  trainerMessage: {
    alignSelf: "flex-start",
    backgroundColor: "#1C2139",
    borderBottomLeftRadius: 4,
  },
  messageText: {
    color: "#fff",
    fontSize: 16,
    lineHeight: 20,
  },
  messageTime: {
    color: "rgba(255, 255, 255, 0.7)",
    fontSize: 12,
    marginTop: 4,
    alignSelf: 'flex-end',
  },
  inputContainer: {
    backgroundColor: "#1C2139",
    paddingHorizontal: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: "rgba(255, 255, 255, 0.1)",
    zIndex: 1000,
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "flex-end",
    backgroundColor: "#090E21",
    borderRadius: 25,
    paddingHorizontal: 16,
    paddingVertical: 8,
    minHeight: 50,
  },
  input: {
    flex: 1,
    color: "#fff",
    fontSize: 16,
    maxHeight: 100,
    paddingVertical: 8,
    paddingRight: 12,
    textAlignVertical: Platform.OS === 'android' ? 'top' : 'center',
  },
  sendButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    overflow: "hidden",
    marginLeft: 8,
  },
  sendButtonGradient: {
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
});