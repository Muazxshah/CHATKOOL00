import { useState, useRef } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import ChatMessages from "@/components/chat-messages";
import MessageInput from "@/components/message-input";
import UsernameModal from "@/components/username-modal";
import { useWebSocket } from "@/hooks/use-websocket";
import { Button } from "@/components/ui/button";
import { apiRequest } from "@/lib/queryClient";
import type { ChatRoom, UserEntry } from "@shared/schema";

export default function Chat() {
  const [currentRoom, setCurrentRoom] = useState<ChatRoom | null>(null);
  const [username, setUsername] = useState<string | null>(null);
  const [matchedUser, setMatchedUser] = useState<string | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  const queryClient = useQueryClient();
  const pollIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const { messages, sendMessage, isConnected } = useWebSocket(currentRoom?.id || undefined, username || undefined);

  const randomChatMutation = useMutation({
    mutationFn: async (username: string) => {
      return await apiRequest('/api/random-chat', 'POST', { username });
    },
    onSuccess: (data: any) => {
      if (data.matched) {
        setCurrentRoom(data.room);
        setMatchedUser(data.matchedUser);
        setIsSearching(false);
      } else {
        // If no match, start polling for matches
        if (username) {
          startPollingForMatches(username);
        }
      }
    }
  });

  const startPollingForMatches = (username: string) => {
    // Clear any existing polling
    if (pollIntervalRef.current) {
      clearInterval(pollIntervalRef.current);
    }

    pollIntervalRef.current = setInterval(async () => {
      try {
        const response = await apiRequest('/api/random-chat', 'POST', { username }) as any;
        if (response.matched) {
          setCurrentRoom(response.room);
          setMatchedUser(response.matchedUser);
          setIsSearching(false);
          if (pollIntervalRef.current) {
            clearInterval(pollIntervalRef.current);
          }
        }
      } catch (error) {
        console.error('Polling error:', error);
      }
    }, 2000); // Poll every 2 seconds

    // Stop polling after 60 seconds
    setTimeout(() => {
      if (pollIntervalRef.current) {
        clearInterval(pollIntervalRef.current);
      }
      setIsSearching(false);
    }, 60000);
  };

  const handleUsernameSubmit = (userData: UserEntry) => {
    setUsername(userData.username);
    localStorage.setItem('chatkool_username', userData.username);
    if (userData.university) {
      localStorage.setItem('chatkool_university', userData.university);
    }
  };

  const startRandomChat = () => {
    if (username) {
      setIsSearching(true);
      randomChatMutation.mutate(username);
    }
  };

  const startNewChat = () => {
    // Clear any active polling
    if (pollIntervalRef.current) {
      clearInterval(pollIntervalRef.current);
    }
    setCurrentRoom(null);
    setMatchedUser(null);
    setIsSearching(false);
  };

  // Check if user already has a stored username
  const storedUsername = localStorage.getItem('chatkool_username');
  if (!username && storedUsername) {
    setUsername(storedUsername);
  }

  // Show username modal if no username is set
  if (!username) {
    return <UsernameModal isOpen={true} onSubmit={handleUsernameSubmit} />;
  }

  return (
    <div className="h-screen bg-white flex flex-col" data-testid="chat-container">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="w-6 h-6 bg-gradient-to-r from-blue-600 to-purple-600 rounded flex items-center justify-center">
              <span className="text-white font-bold text-sm">C</span>
            </div>
            <h1 className="font-bold text-dark-text">ChatKOOL</h1>
          </div>
          <div className="flex items-center space-x-4">
            <span className="text-sm text-neutral-gray">Hi, {username}!</span>
            <div className="flex items-center space-x-2">
              <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-secondary-green' : 'bg-gray-400'}`}></div>
              <span className="text-sm text-neutral-gray">
                {isConnected ? 'Connected' : 'Connecting...'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      {currentRoom && matchedUser ? (
        <div className="flex-1 flex flex-col">
          {/* Chat Header */}
          <div className="border-b border-gray-200 px-6 py-4 bg-white flex items-center justify-between">
            <div>
              <h2 className="font-semibold text-dark-text">Chatting with {matchedUser}</h2>
              <p className="text-sm text-neutral-gray">Direct message</p>
            </div>
            <Button onClick={startNewChat} variant="outline" size="sm" data-testid="button-new-chat">
              New Chat
            </Button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-hidden">
            <ChatMessages messages={messages} roomId={currentRoom.id} />
          </div>

          {/* Message Input */}
          <div className="border-t border-gray-200 p-4 bg-white">
            <MessageInput onSendMessage={sendMessage} />
          </div>
        </div>
      ) : (
        <div className="flex-1 flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50">
          <div className="text-center p-8 max-w-md">
            {isSearching ? (
              <>
                <div className="w-16 h-16 bg-primary-blue rounded-full flex items-center justify-center mb-6 mx-auto animate-pulse">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-dark-text mb-4">Looking for someone to chat...</h3>
                <p className="text-neutral-gray mb-6">We're finding a random Filipino college student for you to connect with!</p>
                <div className="flex items-center justify-center space-x-2">
                  <div className="w-2 h-2 bg-primary-blue rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-primary-blue rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                  <div className="w-2 h-2 bg-primary-blue rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                </div>
              </>
            ) : (
              <>
                <div className="w-20 h-20 bg-gradient-to-r from-primary-blue to-accent-purple rounded-full flex items-center justify-center mb-6 mx-auto">
                  <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-dark-text mb-4">Connect with Random Students</h3>
                <p className="text-neutral-gray mb-8">Start a conversation with a random Filipino college student. Share experiences, get help, or just chat!</p>
                <Button 
                  onClick={startRandomChat} 
                  className="bg-gradient-to-r from-primary-blue to-accent-purple hover:from-blue-600 hover:to-purple-600 px-8 py-3 text-lg font-semibold"
                  data-testid="button-start-random-chat"
                  disabled={isSearching}
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
