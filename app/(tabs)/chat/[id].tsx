import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { GiftedChat } from 'react-native-gifted-chat'; // A popular library for chat UIs
import { useAuth } from '@/context/AuthContext';
// You will need to set up socket.io on the frontend as well
// import socket from '@/lib/socket'; 

export default function ChatScreen() {
    const { id: recipientId } = useLocalSearchParams<{ id: string }>();
    const { recipientName } = useLocalSearchParams<{ recipientName: string }>();
    const { user } = useAuth();
    const [messages, setMessages] = useState([]);

    // This is where you would handle socket.io logic
    useEffect(() => {
        // Example: load previous messages
        // apiClient.get(`/v0/api/messages/${recipientId}`).then(res => setMessages(res.data));

        // Example: listen for new messages
        // socket.on('newMessage', (newMessage) => {
        //   setMessages(previousMessages => GiftedChat.append(previousMessages, newMessage));
        // });

        // return () => socket.off('newMessage');
    }, []);

    const onSend = useCallback((messages = []) => {
        // Example: send a message via socket.io
        // socket.emit('sendMessage', { ...messages[0], recipientId });
        setMessages(previousMessages => GiftedChat.append(previousMessages, messages));
    }, []);

    return (
        <View style={{flex: 1, backgroundColor: '#070F2B'}}>
            <Text style={styles.header}>{recipientName || 'Chat'}</Text>
            <GiftedChat
                messages={messages}
                onSend={messages => onSend(messages)}
                user={{
                    _id: user?._id,
                    name: user?.fullName,
                }}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    header: {
        color: 'white',
        fontSize: 22,
        fontWeight: 'bold',
        textAlign: 'center',
        padding: 15,
        backgroundColor: '#0c1742',
    }
});
