import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  Alert,
  Dimensions,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '../../App';
import { ChatMessage } from '../types';
import { useWebSocket } from '../hooks/useWebSocket';
import { ChatService } from '../services/ChatService';

type ChatScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Chat'>;
type ChatScreenRouteProp = RouteProp<RootStackParamList, 'Chat'>;

interface Props {
  navigation: ChatScreenNavigationProp;
  route: ChatScreenRouteProp;
}

const { width } = Dimensions.get('window');

export default function ChatScreen({ navigation, route }: Props) {
  const { username } = route.params;
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLookingForMatch, setIsLookingForMatch] = useState(true);
  const [matchedUser, setMatchedUser] = useState<string>('');
  const [isAIChat, setIsAIChat] = useState(false);
  const [sending, setSending] = useState(false);
  
  const flatListRef = useRef<FlatList>(null);
  const chatService = useRef(new ChatService()).current;

  // WebSocket connection
  const { 
    connectionStatus, 
    sendMessage: sendWSMessage,
    disconnect 
  } = useWebSocket(username, {
    onMessage: (message) => {
      setMessages(prev => [...prev, message]);
    },
    onUserJoined: (user) => {
      if (user !== username) {
        setMatchedUser(user);
        setIsLookingForMatch(false);
      }
    },
    onUserLeft: () => {
      Alert.alert(
        'User Disconnected', 
        'The other user has left the chat. Looking for a new match...',
        [{ text: 'OK', onPress: startNewChat }]
      );
    }
  });

  useEffect(() => {
    findMatch();
    
    // Cleanup on unmount
    return () => {
      disconnect();
    };
  }, []);

  const findMatch = async () => {
    setIsLookingForMatch(true);
    setMessages([]);
    
    try {
      // Try to find human match for 10 seconds
      let attempts = 0;
      const maxAttempts = 5; // 10 seconds (5 attempts * 2 seconds)
      
      const pollForMatch = async (): Promise<boolean> => {
        attempts++;
        const result = await chatService.findRandomMatch(username);
        
        if (result.matched && result.room && result.user) {
          setMatchedUser(result.user);
          setIsLookingForMatch(false);
          setIsAIChat(false);
          return true;
        }
        
        if (attempts >= maxAttempts) {
          // Connect to AI after timeout
          connectToAI();
          return true;
        }
        
        // Wait 2 seconds before next attempt
        await new Promise(resolve => setTimeout(resolve, 2000));
        return pollForMatch();
      };
      
      await pollForMatch();
    } catch (error) {
      console.error('Error finding match:', error);
      connectToAI();
    }
  };

  const connectToAI = async () => {
    const filipinoNames = [
      'Maria', 'Juan', 'Ana', 'Jose', 'Sofia', 'Miguel', 'Isabelle', 'Carlos',
      'Carmen', 'Luis', 'Mia', 'Diego', 'Elena', 'Pablo', 'Rosa', 'Antonio'
    ];
    
    const aiName = filipinoNames[Math.floor(Math.random() * filipinoNames.length)];
    
    setIsAIChat(true);
    setIsLookingForMatch(false);
    setMatchedUser(aiName);
    
    try {
      // Get AI greeting
      const response = await chatService.sendAIMessage('Hi', username, aiName, true);
      setMessages([{
        id: Date.now().toString(),
        content: response.response,
        username: aiName,
        createdAt: new Date().toISOString()
      }]);
    } catch (error) {
      setMessages([{
        id: Date.now().toString(),
        content: 'Hey! Nice to meet you 😊',
        username: aiName,
        createdAt: new Date().toISOString()
      }]);
    }
  };

  const sendMessage = async () => {
    if (!inputMessage.trim() || sending) return;

    const messageText = inputMessage.trim();
    setInputMessage('');
    setSending(true);

    // Add user message immediately
    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      content: messageText,
      username,
      createdAt: new Date().toISOString()
    };
    setMessages(prev => [...prev, userMessage]);

    try {
      if (isAIChat) {
        // Send to AI
        const response = await chatService.sendAIMessage(messageText, username, matchedUser);
        setMessages(prev => [...prev, {
          id: (Date.now() + 1).toString(),
          content: response.response,
          username: matchedUser,
          createdAt: new Date().toISOString()
        }]);
      } else {
        // Send via WebSocket to real user
        sendWSMessage(messageText);
      }
    } catch (error) {
      console.error('Error sending message:', error);
      Alert.alert('Error', 'Failed to send message. Please try again.');
    } finally {
      setSending(false);
    }
  };

  const startNewChat = () => {
    setMessages([]);
    setMatchedUser('');
    setIsAIChat(false);
    disconnect();
    findMatch();
  };

  const renderMessage = ({ item }: { item: ChatMessage }) => {
    const isOwn = item.username === username;
    
    return (
      <View style={[styles.messageContainer, isOwn && styles.ownMessage]}>
        <View style={[styles.messageBubble, isOwn && styles.ownBubble]}>
          {!isOwn && (
            <Text style={styles.senderName}>{item.username}</Text>
          )}
          <Text style={[styles.messageText, isOwn && styles.ownMessageText]}>
            {item.content}
          </Text>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.container}
      >
        {/* Status Bar */}
        <View style={styles.statusBar}>
          {isLookingForMatch ? (
            <View style={styles.statusContent}>
              <ActivityIndicator size="small" color="#4F46E5" />
              <Text style={styles.statusText}>Looking for a student to chat with...</Text>
            </View>
          ) : (
            <View style={styles.statusContent}>
              <View style={styles.onlineIndicator} />
              <Text style={styles.statusText}>
                Connected with {matchedUser} {isAIChat ? '(Student)' : '(Student)'}
              </Text>
            </View>
          )}
          
          <TouchableOpacity style={styles.newChatButton} onPress={startNewChat}>
            <Text style={styles.newChatText}>New Chat</Text>
          </TouchableOpacity>
        </View>

        {/* Messages */}
        <FlatList
          ref={flatListRef}
          data={messages}
          renderItem={renderMessage}
          keyExtractor={(item) => item.id}
          style={styles.messagesList}
          contentContainerStyle={styles.messagesContent}
          onContentSizeChange={() => flatListRef.current?.scrollToEnd()}
        />

        {/* Input */}
        {!isLookingForMatch && (
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.textInput}
              value={inputMessage}
              onChangeText={setInputMessage}
              placeholder="Type your message..."
              placeholderTextColor="#9CA3AF"
              multiline
              maxLength={500}
              editable={!sending}
            />
            <TouchableOpacity 
              style={[styles.sendButton, (!inputMessage.trim() || sending) && styles.sendButtonDisabled]}
              onPress={sendMessage}
              disabled={!inputMessage.trim() || sending}
            >
              <Text style={styles.sendButtonText}>
                {sending ? '...' : 'Send'}
              </Text>
            </TouchableOpacity>
          </View>
        )}
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  statusBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  statusContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  onlineIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#10B981',
    marginRight: 8,
  },
  statusText: {
    fontSize: 14,
    color: '#6B7280',
    marginLeft: 8,
  },
  newChatButton: {
    backgroundColor: '#4F46E5',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  newChatText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  messagesList: {
    flex: 1,
    paddingHorizontal: 16,
  },
  messagesContent: {
    paddingVertical: 16,
  },
  messageContainer: {
    marginVertical: 4,
    alignItems: 'flex-start',
  },
  ownMessage: {
    alignItems: 'flex-end',
  },
  messageBubble: {
    backgroundColor: '#FFFFFF',
    padding: 12,
    borderRadius: 18,
    maxWidth: width * 0.75,
    borderBottomLeftRadius: 4,
  },
  ownBubble: {
    backgroundColor: '#4F46E5',
    borderBottomLeftRadius: 18,
    borderBottomRightRadius: 4,
  },
  senderName: {
    fontSize: 12,
    color: '#6B7280',
    fontWeight: '600',
    marginBottom: 4,
  },
  messageText: {
    fontSize: 16,
    color: '#374151',
    lineHeight: 20,
  },
  ownMessageText: {
    color: '#FFFFFF',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  textInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: '#374151',
    maxHeight: 100,
    marginRight: 12,
  },
  sendButton: {
    backgroundColor: '#4F46E5',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 20,
  },
  sendButtonDisabled: {
    backgroundColor: '#9CA3AF',
  },
  sendButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});