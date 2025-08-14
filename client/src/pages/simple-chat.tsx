import { useState, useEffect, useRef } from "react";
import { useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { apiRequest } from "@/lib/queryClient";
import UsernameModal from "@/components/username-modal";
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
  const [messages, setMessages] = useState<Message[]>([]);
  const [messageInput, setMessageInput] = useState("");
  const [ws, setWs] = useState<WebSocket | null>(null);
  const pollRef = useRef<NodeJS.Timeout | null>(null);

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
        socket.send(JSON.stringify({
          type: 'join_room',
          roomId: currentRoom.id
        }));
      };

      socket.onmessage = (event) => {
        const data = JSON.parse(event.data);
        if (data.type === 'new_message') {
          setMessages(prev => [...prev, data.message]);
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
        if (pollRef.current) {
          clearInterval(pollRef.current);
          pollRef.current = null;
        }
      } else {
        // Keep polling every 2 seconds
        if (!pollRef.current) {
          pollRef.current = setInterval(() => {
            if (username) {
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

  const sendMessage = () => {
    if (ws && messageInput.trim() && currentRoom) {
      ws.send(JSON.stringify({
        type: 'chat_message',
        content: messageInput.trim()
      }));
      setMessageInput("");
    }
  };

  const startChat = () => {
    if (username) {
      setIsLookingForMatch(true);
      setMessages([]);
      findMatchMutation.mutate(username);
    }
  };

  const startNewChat = () => {
    if (pollRef.current) {
      clearInterval(pollRef.current);
      pollRef.current = null;
    }
    if (ws) {
      ws.close();
    }
    setCurrentRoom(null);
    setMatchedUser(null);
    setMessages([]);
    setIsLookingForMatch(false);
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
    <div className="h-screen bg-white flex flex-col">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="w-6 h-6 bg-gradient-to-r from-blue-600 to-purple-600 rounded flex items-center justify-center">
              <span className="text-white font-bold text-sm">C</span>
            </div>
            <h1 className="font-bold text-gray-900">ChatKOOL</h1>
          </div>
          <div className="flex items-center space-x-4">
            <span className="text-sm text-gray-600">Hi, {username}!</span>
            {currentRoom && (
              <Button onClick={startNewChat} variant="outline" size="sm">
                New Chat
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Chat Interface */}
      {currentRoom && matchedUser ? (
        <div className="flex-1 flex flex-col">
          {/* Chat Header */}
          <div className="border-b border-gray-200 px-6 py-4 bg-gray-50">
            <h2 className="font-semibold text-gray-900">Chatting with {matchedUser}</h2>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${msg.username === username ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                    msg.username === username
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-200 text-gray-900'
                  }`}
                >
                  <p className="text-sm">{msg.content}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Message Input */}
          <div className="border-t border-gray-200 p-4">
            <div className="flex space-x-2">
              <Input
                value={messageInput}
                onChange={(e) => setMessageInput(e.target.value)}
                placeholder="Type your message..."
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    sendMessage();
                  }
                }}
                className="flex-1"
              />
              <Button onClick={sendMessage}>Send</Button>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center p-8">
            {isLookingForMatch ? (
              <>
                <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mb-6 mx-auto animate-pulse">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">Looking for someone to chat...</h3>
                <p className="text-gray-600 mb-6">Finding a random student for you to connect with!</p>
                <div className="flex items-center justify-center space-x-2">
                  <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                  <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                </div>
              </>
            ) : (
              <>
                <div className="w-20 h-20 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center mb-6 mx-auto">
                  <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Connect with Random Students</h3>
                <p className="text-gray-600 mb-8">Start a conversation with a random Filipino college student!</p>
                <Button 
                  onClick={startChat} 
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 px-8 py-3 text-lg font-semibold"
                  disabled={isLookingForMatch}
                >
                  Start Random Chat
                </Button>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}