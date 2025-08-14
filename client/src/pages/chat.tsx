import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import ChatSidebar from "@/components/chat-sidebar";
import ChatMessages from "@/components/chat-messages";
import MessageInput from "@/components/message-input";
import UsernameModal from "@/components/username-modal";
import { useWebSocket } from "@/hooks/use-websocket";
import type { ChatRoom, UserEntry } from "@shared/schema";

export default function Chat() {
  const [selectedRoom, setSelectedRoom] = useState<ChatRoom | null>(null);
  const [username, setUsername] = useState<string | null>(null);
  
  const { data: rooms = [], isLoading } = useQuery<ChatRoom[]>({
    queryKey: ['/api/rooms'],
    queryFn: async () => {
      const response = await fetch('/api/rooms');
      if (!response.ok) throw new Error('Failed to fetch rooms');
      return response.json();
    }
  });

  const { messages, sendMessage, isConnected } = useWebSocket(selectedRoom?.id, username);

  const handleUsernameSubmit = (userData: UserEntry) => {
    setUsername(userData.username);
    localStorage.setItem('chatkool_username', userData.username);
    if (userData.university) {
      localStorage.setItem('chatkool_university', userData.university);
    }
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

  if (isLoading) {
    return (
      <div className="min-h-screen bg-bg-light flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-blue mx-auto mb-4"></div>
          <p className="text-neutral-gray">Loading chat rooms...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen bg-white flex" data-testid="chat-container">
      {/* Header */}
      <div className="fixed top-0 left-0 right-0 bg-white border-b border-gray-200 px-4 py-3 z-10">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <img 
              src="https://www.chatkool.com/static/media/mainlogo.680cdbd559a984017e33.png" 
              alt="ChatKOOL" 
              className="h-6 w-auto"
            />
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

      <div className="flex flex-1 mt-16">
        {/* Sidebar */}
        <ChatSidebar 
          rooms={rooms}
          selectedRoom={selectedRoom}
          onRoomSelect={setSelectedRoom}
          data-testid="chat-sidebar"
        />

        {/* Main Chat Area */}
        <div className="flex-1 flex flex-col">
          {selectedRoom ? (
            <>
              {/* Chat Header */}
              <div className="bg-white border-b border-gray-200 p-4" data-testid="chat-header">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold text-dark-text" data-testid="text-room-name">
                      # {selectedRoom.name}
                    </h3>
                    <p className="text-sm text-neutral-gray" data-testid="text-room-description">
                      {selectedRoom.description}
                    </p>
                  </div>
                </div>
              </div>

              {/* Messages */}
              <ChatMessages 
                messages={messages}
                roomId={selectedRoom.id}
                data-testid="chat-messages"
              />

              {/* Message Input */}
              <MessageInput 
                onSendMessage={sendMessage}
                placeholder={`Message #${selectedRoom.name}`}
                data-testid="message-input"
              />
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center bg-bg-light" data-testid="no-room-selected">
              <div className="text-center max-w-md mx-auto px-4">
                <div className="w-16 h-16 bg-primary-blue rounded-full flex items-center justify-center mx-auto mb-6">
                  <span className="text-white text-2xl">#</span>
                </div>
                <h3 className="text-xl font-semibold text-dark-text mb-4">
                  Welcome to ChatKOOL!
                </h3>
                <p className="text-neutral-gray">
                  Select a room from the sidebar to start chatting with fellow Filipino college students.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
