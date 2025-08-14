import { useEffect, useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import type { MessageWithUser } from "@shared/schema";

interface ChatMessagesProps {
  messages: MessageWithUser[];
  roomId: string;
}

export default function ChatMessages({ messages, roomId }: ChatMessagesProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Fetch initial messages when room changes
  const { data: initialMessages = [] } = useQuery<MessageWithUser[]>({
    queryKey: ['/api/rooms', roomId, 'messages'],
    queryFn: async () => {
      const response = await fetch(`/api/rooms/${roomId}/messages`);
      if (!response.ok) throw new Error('Failed to fetch messages');
      return response.json();
    },
    enabled: !!roomId,
  });

  // Combine initial messages with live messages, avoiding duplicates
  const allMessages = [...initialMessages, ...messages.filter(msg => 
    !initialMessages.some(initial => initial.id === msg.id)
  )];

  const getInitials = (name: string): string => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .substring(0, 2)
      .toUpperCase();
  };

  const getAvatarColor = (userId: string): string => {
    const colors = ['bg-primary-blue', 'bg-secondary-green', 'bg-accent-purple', 'bg-orange-500', 'bg-pink-500', 'bg-indigo-500'];
    const hash = userId.split('').reduce((a, b) => a + b.charCodeAt(0), 0);
    return colors[hash % colors.length];
  };

  const formatTime = (date: Date | string): string => {
    const messageDate = new Date(date);
    const now = new Date();
    const isToday = messageDate.toDateString() === now.toDateString();
    
    if (isToday) {
      return messageDate.toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
      });
    } else {
      return messageDate.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
      });
    }
  };

  if (!allMessages.length) {
    return (
      <div className="flex-1 flex items-center justify-center bg-bg-light" data-testid="empty-messages">
        <div className="text-center">
          <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-gray-400 text-2xl">#</span>
          </div>
          <h3 className="text-lg font-semibold text-dark-text mb-2">
            No messages yet
          </h3>
          <p className="text-neutral-gray">
            Be the first to start the conversation!
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 p-4 space-y-4 overflow-y-auto bg-bg-light" data-testid="chat-messages">
      {allMessages.map((message) => (
        <div key={message.id} className="flex items-start space-x-3" data-testid={`message-${message.id}`}>
          <div className={`w-8 h-8 ${getAvatarColor(message.user.id)} rounded-full flex items-center justify-center flex-shrink-0`}>
            <span className="text-white text-xs font-semibold">
              {getInitials(message.user.fullName)}
            </span>
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center space-x-2 mb-1">
              <span className="font-semibold text-dark-text text-sm" data-testid={`text-username-${message.id}`}>
                {message.user.fullName}
              </span>
              <span className="text-xs text-neutral-gray" data-testid={`text-timestamp-${message.id}`}>
                {formatTime(message.createdAt!)}
              </span>
            </div>
            <p className="text-sm text-neutral-gray break-words" data-testid={`text-content-${message.id}`}>
              {message.content}
            </p>
          </div>
        </div>
      ))}
      <div ref={messagesEndRef} />
    </div>
  );
}
