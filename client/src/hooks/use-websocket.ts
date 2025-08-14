import { useState, useEffect, useRef } from "react";
import { getAuthToken } from "@/lib/auth";
import type { MessageWithUser } from "@shared/schema";

export function useWebSocket(roomId?: string) {
  const [messages, setMessages] = useState<MessageWithUser[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const wsRef = useRef<WebSocket | null>(null);
  const currentRoomRef = useRef<string | undefined>(roomId);

  useEffect(() => {
    currentRoomRef.current = roomId;
  }, [roomId]);

  useEffect(() => {
    const protocol = window.location.protocol === "https:" ? "wss:" : "ws:";
    const wsUrl = `${protocol}//${window.location.host}/ws`;
    
    const ws = new WebSocket(wsUrl);
    wsRef.current = ws;

    ws.onopen = () => {
      console.log('WebSocket connected');
      setIsConnected(true);
      
      // Authenticate the connection
      const token = getAuthToken();
      if (token) {
        ws.send(JSON.stringify({
          type: 'auth',
          token: token
        }));
      }
    };

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      
      switch (data.type) {
        case 'auth_success':
          console.log('WebSocket authenticated');
          // Join the current room if one is selected
          if (currentRoomRef.current) {
            ws.send(JSON.stringify({
              type: 'join_room',
              roomId: currentRoomRef.current
            }));
          }
          break;
          
        case 'auth_error':
          console.error('WebSocket auth error:', data.message);
          break;
          
        case 'joined_room':
          console.log('Joined room:', data.roomId);
          // Clear messages when joining a new room
          if (data.roomId !== currentRoomRef.current) {
            setMessages([]);
          }
          break;
          
        case 'new_message':
          setMessages(prev => [...prev, data.message]);
          break;
          
        default:
          console.log('Unknown message type:', data.type);
      }
    };

    ws.onclose = () => {
      console.log('WebSocket disconnected');
      setIsConnected(false);
    };

    ws.onerror = (error) => {
      console.error('WebSocket error:', error);
      setIsConnected(false);
    };

    return () => {
      ws.close();
    };
  }, []);

  // Join room when roomId changes
  useEffect(() => {
    if (wsRef.current?.readyState === WebSocket.OPEN && roomId) {
      setMessages([]); // Clear messages when switching rooms
      wsRef.current.send(JSON.stringify({
        type: 'join_room',
        roomId: roomId
      }));
    }
  }, [roomId]);

  const sendMessage = (content: string) => {
    if (wsRef.current?.readyState === WebSocket.OPEN && roomId) {
      wsRef.current.send(JSON.stringify({
        type: 'chat_message',
        content: content
      }));
    }
  };

  return {
    messages,
    sendMessage,
    isConnected
  };
}
