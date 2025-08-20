import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Dimensions,
  KeyboardAvoidingView,
  Platform,
  StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../App';

type HomeScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Home'>;

interface Props {
  navigation: HomeScreenNavigationProp;
}

const { width } = Dimensions.get('window');

export default function HomeScreen({ navigation }: Props) {
  const [username, setUsername] = useState('');
  const [loading, setLoading] = useState(false);

  const handleStartChat = async () => {
    if (!username.trim()) {
      Alert.alert('Error', 'Please enter a username to start chatting');
      return;
    }

    if (username.length < 2) {
      Alert.alert('Error', 'Username must be at least 2 characters long');
      return;
    }

    setLoading(true);
    
    // Navigate to chat screen
    navigation.navigate('Chat', { username: username.trim() });
    setLoading(false);
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#4F46E5" />
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <View style={styles.content}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.title}>ChatKOOL</Text>
            <Text style={styles.subtitle}>
              Anonymous chat for Filipino college students
            </Text>
          </View>

          {/* Main Content */}
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

            {/* Username Input */}
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

            {/* Start Chat Button */}
            <TouchableOpacity
              style={[styles.button, loading && styles.buttonDisabled]}
              onPress={handleStartChat}
              disabled={loading}
            >
              <Text style={styles.buttonText}>
                {loading ? 'Starting...' : 'Start Chatting'}
              </Text>
            </TouchableOpacity>
          </View>

          {/* Footer */}
          <View style={styles.footer}>
            <Text style={styles.footerText}>
              Chat safely and respectfully{'\n'}
              Para sa Filipino students, by Filipino students
            </Text>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  keyboardView: {
    flex: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    justifyContent: 'space-between',
  },
  header: {
    alignItems: 'center',
    paddingTop: 40,
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
  buttonDisabled: {
    backgroundColor: '#9CA3AF',
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
});