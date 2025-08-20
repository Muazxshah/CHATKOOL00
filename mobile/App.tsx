import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView,
  SafeAreaView,
  Dimensions,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';

const { width, height } = Dimensions.get('window');

// Simple chat interface without complex navigation
export default function App() {
  const [currentScreen, setCurrentScreen] = useState<'home' | 'chat'>('home');
  const [username, setUsername] = useState('');
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<Array<{ text: string; sender: 'user' | 'other' }>>([]);
  const [loading, setLoading] = useState(false);

  const handleStartChat = () => {
    if (!username.trim()) {
      Alert.alert('Error', 'Please enter a username to start chatting');
      return;
    }

    if (username.length < 2) {
      Alert.alert('Error', 'Username must be at least 2 characters long');
      return;
    }

    setCurrentScreen('chat');
    // Add welcome message
    setMessages([
      { text: `Welcome ${username}! You're now connected to a random Filipino student.`, sender: 'other' }
    ]);
  };

  const sendMessage = () => {
    if (!message.trim()) return;

    // Add user message
    const newMessages = [...messages, { text: message, sender: 'user' as const }];
    setMessages(newMessages);
    setMessage('');
    setLoading(true);

    // Simulate AI response
    setTimeout(() => {
      const responses = [
        "Kumusta ka? I'm also a college student here in Manila!",
        "Nice to meet you! What course are you taking?",
        "Hey there! Are you also studying for finals?",
        "Hello! I'm from UP Diliman, how about you?",
        "Hi! Good to chat with a fellow Filipino student.",
        "Kumain ka na ba? Let's chat about school life!",
        "Hey! What year are you in college?",
        "Nice! I'm also stressed with academics haha"
      ];
      
      const randomResponse = responses[Math.floor(Math.random() * responses.length)];
      setMessages(prev => [...prev, { text: randomResponse, sender: 'other' }]);
      setLoading(false);
    }, 1000);
  };

  const startNewChat = () => {
    setMessages([]);
    setCurrentScreen('home');
    setUsername('');
  };

  if (currentScreen === 'home') {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar style="light" backgroundColor="#4F46E5" />
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={styles.header}>
            <Text style={styles.title}>ChatKOOL</Text>
            <Text style={styles.subtitle}>
              Anonymous chat for Filipino college students
            </Text>
          </View>

          <View style={styles.main}>
            <Text style={styles.description}>
              Connect instantly with fellow Filipino students. Share experiences, get academic help, and make friends - all anonymously!
            </Text>

            <Text style={styles.features}>
              ✨ No registration required{'\n'}
              🔒 Completely anonymous{'\n'}
              🇵🇭 Filipino college community{'\n'}
              ⚡ Instant random connections
            </Text>

            <View style={styles.inputSection}>
              <Text style={styles.inputLabel}>Choose a username:</Text>
              <TextInput
                style={styles.input}
                value={username}
                onChangeText={setUsername}
                placeholder="Enter your username"
                placeholderTextColor="#9CA3AF"
                maxLength={20}
                autoCapitalize="none"
                autoCorrect={false}
              />
            </View>

            <TouchableOpacity
              style={styles.button}
              onPress={handleStartChat}
            >
              <Text style={styles.buttonText}>Start Chatting</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.footer}>
            <Text style={styles.footerText}>
              Chat safely and respectfully{'\n'}
              Para sa Filipino students, by Filipino students
            </Text>
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" backgroundColor="#4F46E5" />
      
      {/* Chat Header */}
      <View style={styles.chatHeader}>
        <TouchableOpacity onPress={startNewChat} style={styles.backButton}>
          <Text style={styles.backButtonText}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.chatTitle}>Anonymous Chat</Text>
        <TouchableOpacity onPress={startNewChat} style={styles.newChatButton}>
          <Text style={styles.newChatButtonText}>New Chat</Text>
        </TouchableOpacity>
      </View>

      {/* Messages */}
      <ScrollView style={styles.messagesContainer}>
        {messages.map((msg, index) => (
          <View
            key={index}
            style={[
              styles.messageCard,
              msg.sender === 'user' ? styles.userMessage : styles.otherMessage,
            ]}
          >
            <Text style={[
              styles.messageText,
              msg.sender === 'user' ? styles.userMessageText : styles.otherMessageText,
            ]}>
              {msg.text}
            </Text>
          </View>
        ))}
        {loading && (
          <View style={styles.loadingMessage}>
            <Text style={styles.loadingText}>Typing...</Text>
          </View>
        )}
      </ScrollView>

      {/* Message Input */}
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.messageInput}
          value={message}
          onChangeText={setMessage}
          placeholder="Type your message..."
          placeholderTextColor="#9CA3AF"
          multiline
        />
        <TouchableOpacity
          style={styles.sendButton}
          onPress={sendMessage}
          disabled={!message.trim() || loading}
        >
          <Text style={styles.sendButtonText}>Send</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 24,
    justifyContent: 'space-between',
  },
  header: {
    alignItems: 'center',
    paddingTop: 40,
    paddingBottom: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#4F46E5',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
  },
  main: {
    flex: 1,
    justifyContent: 'center',
    paddingVertical: 40,
  },
  description: {
    fontSize: 16,
    color: '#374151',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 32,
  },
  features: {
    fontSize: 16,
    color: '#4F46E5',
    textAlign: 'center',
    lineHeight: 28,
    marginBottom: 40,
    fontWeight: '500',
  },
  inputSection: {
    marginBottom: 32,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 12,
    textAlign: 'center',
  },
  input: {
    borderWidth: 2,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 16,
    fontSize: 16,
    color: '#111827',
    backgroundColor: '#FFFFFF',
    textAlign: 'center',
    fontWeight: '500',
  },
  button: {
    backgroundColor: '#4F46E5',
    paddingVertical: 18,
    paddingHorizontal: 32,
    borderRadius: 12,
    alignItems: 'center',
    elevation: 3,
    shadowColor: '#4F46E5',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  footer: {
    paddingBottom: 20,
  },
  footerText: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 20,
  },
  // Chat Screen Styles
  chatHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#4F46E5',
    paddingHorizontal: 16,
    paddingVertical: 12,
    paddingTop: 20,
  },
  backButton: {
    padding: 8,
  },
  backButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  chatTitle: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  newChatButton: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  newChatButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  messagesContainer: {
    flex: 1,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  messageCard: {
    marginVertical: 4,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    maxWidth: '75%',
  },
  userMessage: {
    backgroundColor: '#4F46E5',
    alignSelf: 'flex-end',
  },
  otherMessage: {
    backgroundColor: '#FFFFFF',
    alignSelf: 'flex-start',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  messageText: {
    fontSize: 16,
    lineHeight: 20,
  },
  userMessageText: {
    color: '#FFFFFF',
  },
  otherMessageText: {
    color: '#374151',
  },
  loadingMessage: {
    alignSelf: 'flex-start',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  loadingText: {
    color: '#9CA3AF',
    fontStyle: 'italic',
  },
  inputContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    alignItems: 'flex-end',
  },
  messageInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    backgroundColor: '#F9FAFB',
    maxHeight: 100,
  },
  sendButton: {
    backgroundColor: '#4F46E5',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 20,
    marginLeft: 8,
  },
  sendButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});