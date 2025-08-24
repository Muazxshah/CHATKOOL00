import { useState, useEffect, useRef, useCallback } from "react";
import { useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { apiRequest } from "@/lib/queryClient";
import UsernameModal from "@/components/username-modal";
import { useLocation } from "wouter";
import type { ChatRoom, UserEntry } from "@shared/schema";

interface Message {
  id: string;
  content: string;
  username: string;
  createdAt: string;
}

export default function SimpleChat() {
  const [currentRoom, setCurrentRoom] = useState<ChatRoom | null>(null);
  const [username, setUsername] = useState<string | null>(null);
  const [matchedUser, setMatchedUser] = useState<string | null>(null);
  const [isLookingForMatch, setIsLookingForMatch] = useState(false);
  const [isAIChat, setIsAIChat] = useState(false);
  const [aiTimeoutId, setAiTimeoutId] = useState<NodeJS.Timeout | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [messageInput, setMessageInput] = useState("");
  const [ws, setWs] = useState<WebSocket | null>(null);
  const pollRef = useRef<NodeJS.Timeout | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const [isPartnerTyping, setIsPartnerTyping] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [, setLocation] = useLocation();

  // Simple WebSocket connection
  useEffect(() => {
    if (currentRoom && username) {
      const protocol = window.location.protocol === "https:" ? "wss:" : "ws:";
      const wsUrl = `${protocol}//${window.location.host}/ws`;
      const socket = new WebSocket(wsUrl);

      socket.onopen = () => {
        console.log('WebSocket connected');
        socket.send(JSON.stringify({
          type: 'set_username',
          username: username
        }));
        // Delay joining room slightly to ensure username is set first
        setTimeout(() => {
          console.log('Joining room:', currentRoom.id);
          socket.send(JSON.stringify({
            type: 'join_room',
            roomId: currentRoom.id
          }));
        }, 100);
      };

      socket.onmessage = (event) => {
        const data = JSON.parse(event.data);
        console.log('WebSocket message received:', data);
        
        if (data.type === 'new_message') {
          setMessages(prev => [...prev, data.message]);
        } else if (data.type === 'user_typing') {
          console.log('Typing event received:', data);
          setIsPartnerTyping(data.isTyping);
        } else if (data.type === 'chat_ended') {
          console.log('Chat ended by other user:', data.message);
          // Add system message
          setMessages(prev => [...prev, {
            id: 'system-' + Date.now(),
            content: 'Your chat partner has left the conversation',
            username: 'System',
            createdAt: new Date().toISOString()
          }]);
          // Reset chat after 3 seconds so user can see the message
          setTimeout(() => {
            startNewChat();
          }, 3000);
        } else if (data.type === 'username_set') {
          console.log('Username set on WebSocket');
        } else if (data.type === 'joined_room') {
          console.log('Successfully joined room:', data.roomId);
        }
      };

      setWs(socket);

      return () => {
        socket.close();
      };
    }
  }, [currentRoom, username]);

  const findMatchMutation = useMutation({
    mutationFn: async (username: string) => {
      const res = await apiRequest('POST', '/api/random-chat', { username });
      return await res.json();
    },
    onSuccess: (data) => {
      console.log('Match response:', data);
      if (data.matched) {
        setCurrentRoom(data.room);
        setMatchedUser(data.matchedUser);
        setIsLookingForMatch(false);
        
        // Clear timers
        if (pollRef.current) {
          clearInterval(pollRef.current);
          pollRef.current = null;
        }
        if (aiTimeoutId) {
          clearTimeout(aiTimeoutId);
          setAiTimeoutId(null);
        }
      } else {
        // Keep polling every 2 seconds
        if (!pollRef.current) {
          pollRef.current = setInterval(() => {
            if (username && !isAIChat) {
              findMatchMutation.mutate(username);
            }
          }, 2000);
        }
      }
    },
    onError: () => {
      setIsLookingForMatch(false);
    }
  });

  const sendMessage = useCallback(async () => {
    if (!messageInput.trim() || !currentRoom) return;

    const messageToSend = messageInput.trim();
    setMessageInput(""); // Clear input immediately for better UX
    
    // Stop typing indicator when sending message
    stopTyping();
    
    // Keep focus on input field to maintain mobile keyboard
    setTimeout(() => {
      if (inputRef.current) {
        inputRef.current.focus();
      }
    }, 50);

    if (isAIChat) {
      // Handle AI Chat
      const userMessage = {
        id: Date.now().toString(),
        content: messageToSend,
        username: username!,
        createdAt: new Date().toISOString()
      };
      
      setMessages(prev => [...prev, userMessage]);
      
      // Show AI typing indicator
      setIsPartnerTyping(true);
      
      // Send to AI
      try {
        const response = await fetch('/api/ai-chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ message: messageToSend, username, aiName: matchedUser })
        });
        
        const data = await response.json();
        
        // Hide AI typing indicator and show message
        setIsPartnerTyping(false);
        
        const aiMessage = {
          id: Date.now().toString() + '-ai',
          content: data.response,
          username: matchedUser!,
          createdAt: new Date().toISOString()
        };
        
        setTimeout(() => {
          setMessages(prev => [...prev, aiMessage]);
        }, 300); // Small delay for natural feel
      } catch (error) {
        console.error('AI chat error:', error);
        setIsPartnerTyping(false);
        const errorMessage = {
          id: Date.now().toString() + '-error',
          content: 'Sorry, connection\'s a bit slow here. What were you saying?',
          username: matchedUser!,
          createdAt: new Date().toISOString()
        };
        setMessages(prev => [...prev, errorMessage]);
      }
    } else if (ws) {
      // Handle Human Chat
      ws.send(JSON.stringify({
        type: 'chat_message',
        content: messageToSend
      }));
    }
  }, [messageInput, currentRoom, isAIChat, username, matchedUser, ws]);
  
  const startTyping = useCallback(() => {
    if (!isTyping && ws && !isAIChat) {
      setIsTyping(true);
      ws.send(JSON.stringify({ type: 'typing_start' }));
    }
    
    // Clear existing timeout
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }
    
    // Set timeout to stop typing after 2 seconds of inactivity
    typingTimeoutRef.current = setTimeout(() => {
      stopTyping();
    }, 2000);
  }, [isTyping, ws, isAIChat]);
  
  const stopTyping = useCallback(() => {
    if (isTyping && ws && !isAIChat) {
      setIsTyping(false);
      ws.send(JSON.stringify({ type: 'typing_stop' }));
    }
    
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
      typingTimeoutRef.current = null;
    }
  }, [isTyping, ws, isAIChat]);
  
  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setMessageInput(e.target.value);
    
    if (e.target.value.trim() && !isAIChat) {
      startTyping();
    } else if (!e.target.value.trim()) {
      stopTyping();
    }
  }, [startTyping, stopTyping, isAIChat]);

  const startChat = () => {
    if (username) {
      setIsLookingForMatch(true);
      setMessages([]);
      setIsAIChat(false);
      
      // Start 10-second timer for automatic AI connection
      const timeoutId = setTimeout(() => {
        console.log('10-second timeout - connecting to AI as fake user');
        connectToAI();
      }, 10000);
      setAiTimeoutId(timeoutId);
      console.log('Started 10-second timeout timer');
      
      findMatchMutation.mutate(username);
    }
  };

  const endChat = () => {
    if (ws) {
      console.log('Sending end_chat message');
      ws.send(JSON.stringify({
        type: 'end_chat'
      }));
    }
  };

  // Filipino student names for AI to use
  const filipinoNames = ['Miguel', 'Sofia', 'Carlos', 'Maya', 'Paulo', 'Luna', 'Diego', 'Ava', 'Rico', 'Kira', 'Jun', 'Mia', 'Luis', 'Zara', 'Marco'];
  
  const connectToAI = () => {
    const aiName = filipinoNames[Math.floor(Math.random() * filipinoNames.length)];
    
    setIsAIChat(true);
    setIsLookingForMatch(false);
    setMatchedUser(aiName);
    setCurrentRoom({ id: 'ai-chat-room', participants: [username, aiName] } as any);
    
    // Set AI name on server and get a natural greeting
    fetch('/api/ai-chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: 'Hi', username, aiName, isFirstMessage: true })
    })
    .then(res => res.json())
    .then(data => {
      setMessages([{
        id: 'ai-welcome',
        content: data.response,
        username: aiName,
        createdAt: new Date().toISOString()
      }]);
    })
    .catch(() => {
      setMessages([{
        id: 'ai-welcome',
        content: 'Hey! Nice to meet you 😊',
        username: aiName,
        createdAt: new Date().toISOString()
      }]);
    });
    
    // Clear timers
    if (pollRef.current) {
      clearInterval(pollRef.current);
      pollRef.current = null;
    }
    if (aiTimeoutId) {
      clearTimeout(aiTimeoutId);
      setAiTimeoutId(null);
    }
  };

  const startNewChat = () => {
    // If we're in an active chat, notify the server we're ending it
    if (currentRoom && ws && !isAIChat) {
      endChat();
    }
    
    // Clean up typing indicators
    stopTyping();
    setIsPartnerTyping(false);
    
    if (pollRef.current) {
      clearInterval(pollRef.current);
      pollRef.current = null;
    }
    if (aiTimeoutId) {
      clearTimeout(aiTimeoutId);
      setAiTimeoutId(null);
    }
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
      typingTimeoutRef.current = null;
    }
    if (ws) {
      ws.close();
    }
    setCurrentRoom(null);
    setMatchedUser(null);
    setMessages([]);
    setIsLookingForMatch(false);
    setIsAIChat(false);
    setIsTyping(false);
  };

  const handleUsernameSubmit = (userData: UserEntry) => {
    setUsername(userData.username);
    localStorage.setItem('chatkool_username', userData.username);
  };

  // Auto-load saved username
  useEffect(() => {
    const saved = localStorage.getItem('chatkool_username');
    if (saved && !username) {
      setUsername(saved);
    }
  }, []);

  if (!username) {
    return <UsernameModal isOpen={true} onSubmit={handleUsernameSubmit} />;
  }

  return (
    <div className="h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex flex-col overflow-x-hidden max-w-full">
      {/* Premium Header */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-gray-200/50 px-4 sm:px-6 py-3 sm:py-4 shadow-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2 sm:space-x-3 cursor-pointer hover:opacity-80 transition-opacity" onClick={() => setLocation('/')}>
            <div className="w-6 h-6 sm:w-8 sm:h-8 bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg hover:shadow-xl transition-shadow duration-200">
              <span className="text-white font-bold text-sm sm:text-lg">C</span>
            </div>
            <div>
              <h1 className="font-bold text-gray-900 text-base sm:text-lg hover:text-purple-600 transition-colors duration-200">ChatKOOL</h1>
              <p className="text-xs text-gray-500 hidden sm:block">Connect with students</p>
            </div>
          </div>
          <div className="flex items-center space-x-2 sm:space-x-4">
            <div className="flex items-center space-x-2 bg-green-50 px-2 sm:px-3 py-1 sm:py-1.5 rounded-full">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-xs sm:text-sm font-medium text-green-700">{username}</span>
            </div>
            {currentRoom && (
              <Button 
                onClick={startNewChat} 
                size="sm"
                className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white border-0 shadow-md hover:shadow-lg transition-all duration-200 text-xs sm:text-sm px-2 sm:px-4"
              >
                New Chat
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Premium Chat Interface */}
      {currentRoom && matchedUser ? (
        <div className="flex-1 flex flex-col max-w-4xl mx-auto w-full">
          {/* Chat Header - Compact Premium */}
          <div className="bg-white/90 backdrop-blur-sm border-b border-gray-100 px-4 sm:px-6 py-3 mx-2 sm:mx-4 mt-2 sm:mt-4 rounded-t-xl shadow-sm">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center shadow-md">
                  <span className="text-white font-semibold text-lg">{matchedUser.charAt(0).toUpperCase()}</span>
                </div>
                <div>
                  <h2 className="font-semibold text-gray-900">{matchedUser}</h2>
                  <p className="text-xs text-green-600 font-medium">● Online</p>
                </div>
              </div>
              <div className="text-xs text-gray-500">Anonymous Chat</div>
            </div>
          </div>

          {/* Messages - Compact Design */}
          <div className="flex-1 overflow-y-auto px-4 sm:px-6 py-4 mx-2 sm:mx-4 bg-white/50 backdrop-blur-sm space-y-3">
            {messages.length === 0 ? (
              <div className="flex items-center justify-center h-full">
                <div className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center mb-4 mx-auto shadow-lg">
                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                  </div>
                  <p className="text-gray-600 font-medium">Start your conversation!</p>
                  <p className="text-sm text-gray-500">Say hello to {matchedUser}</p>
                </div>
              </div>
            ) : (
              messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex ${msg.username === username ? 'justify-end' : msg.username === 'System' ? 'justify-center' : 'justify-start'}`}
                >
                  {msg.username === 'System' ? (
                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg px-3 py-2 mb-2">
                      <p className="text-sm text-yellow-800 text-center font-medium">{msg.content}</p>
                    </div>
                  ) : (
                    <div className={`flex items-end space-x-2 max-w-xs sm:max-w-sm ${msg.username === username ? 'flex-row-reverse space-x-reverse' : ''}`}>
                      {msg.username !== username && (
                        <div className="w-6 h-6 bg-gradient-to-br from-gray-400 to-gray-500 rounded-full flex-shrink-0 flex items-center justify-center">
                          <span className="text-white text-xs font-medium">{msg.username.charAt(0).toUpperCase()}</span>
                        </div>
                      )}
                      <div
                        className={`px-3 sm:px-4 py-2 sm:py-2.5 rounded-2xl shadow-sm ${
                          msg.username === username
                            ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white'
                            : 'bg-white text-gray-900 border border-gray-200'
                        }`}
                      >
                        <p className="text-xs sm:text-sm leading-relaxed break-words">{msg.content}</p>
                      </div>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>

          {/* Typing Indicator */}
          {isPartnerTyping && (
            <div className="px-4 sm:px-6 py-2 mx-2 sm:mx-4">
              <div className="flex items-center space-x-2 text-gray-500 text-sm">
                <span>{matchedUser} is typing</span>
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0ms'}}></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '150ms'}}></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '300ms'}}></div>
                </div>
              </div>
            </div>
          )}

          {/* Message Input - Premium Compact */}
          <div className="bg-white/90 backdrop-blur-sm border-t border-gray-100 px-4 sm:px-6 py-3 sm:py-4 mx-2 sm:mx-4 mb-2 sm:mb-4 rounded-b-xl shadow-sm">
            <div className="flex space-x-2 sm:space-x-3">
              <Button 
                onClick={startNewChat}
                variant="outline"
                className="border-red-200 text-red-600 hover:bg-red-50 hover:border-red-300 rounded-xl px-2 sm:px-4 text-xs sm:text-sm"
              >
                End Chat
              </Button>
              <Input
                ref={inputRef}
                value={messageInput}
                onChange={handleInputChange}
                onBlur={stopTyping}
                placeholder="Type your message..."
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    sendMessage();
                  }
                }}
                autoComplete="off"
                autoCorrect="off"
                autoCapitalize="sentences"
                className="flex-1 border-gray-200 focus:border-purple-400 focus:ring-purple-400 rounded-xl bg-gray-50 focus:bg-white transition-colors"
              />
              <Button 
                onClick={sendMessage}
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white border-0 rounded-xl px-3 sm:px-6 shadow-md hover:shadow-lg transition-all duration-200"
              >
                <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
              </Button>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex-1 flex items-center justify-center p-8">
          <div className="text-center max-w-md mx-auto">
            {isLookingForMatch ? (
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-gray-100">
                <div className="relative mb-6">
                  <div className="w-20 h-20 bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-600 rounded-2xl flex items-center justify-center mx-auto shadow-xl animate-pulse">
                    <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                  </div>
                  <div className="absolute -top-2 -right-2 w-6 h-6 bg-green-500 rounded-full border-2 border-white animate-ping"></div>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">Finding your match...</h3>
                <p className="text-gray-600 mb-6 text-sm">Connecting you with another student right now!</p>
                <div className="flex items-center justify-center space-x-2">
                  <div className="w-2 h-2 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                  <div className="w-2 h-2 bg-gradient-to-r from-pink-600 to-red-600 rounded-full animate-bounce" style={{animationDelay: '0.4s'}}></div>
                </div>
              </div>
            ) : (
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-10 shadow-xl border border-gray-100">
                <div className="w-24 h-24 bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-600 rounded-2xl flex items-center justify-center mb-6 mx-auto shadow-2xl">
                  <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Connect Instantly</h3>
                <p className="text-gray-600 mb-8 leading-relaxed">Start an anonymous conversation with a random Filipino college student. Share experiences, get help, or just have fun!</p>
                <Button 
                  onClick={startChat} 
                  className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 hover:from-blue-700 hover:via-purple-700 hover:to-indigo-700 px-8 py-4 text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                  disabled={isLookingForMatch}
                >
                  Start Random Chat
                </Button>
                <p className="text-xs text-gray-500 mt-4">Anonymous • Secure • Instant</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}