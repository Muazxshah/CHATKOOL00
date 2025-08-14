import { useState, useEffect, useRef } from "react";
import type { MessageWithUser } from "@shared/schema";

export function useWebSocket(roomId?: string, username?: string, onMatchFound?: (match: { room: any; matchedUser: string }) => void) {
  const [messages, setMessages] = useState<MessageWithUser[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const wsRef = useRef<WebSocket | null>(null);
  const currentRoomRef = useRef<string | undefined>(roomId);

  useEffect(() => {
    currentRoomRef.current = roomId;
  }, [roomId]);

  useEffect(() => {
    // Force WSS for custom domains to handle SSL properly
    const protocol = (window.location.protocol === "https:" || window.location.host.includes('chatkool.net')) ? "wss:" : "ws:";
    const host = window.location.host;
    const wsUrl = `${protocol}//${host}/ws`;
    
    console.log('Connecting to WebSocket:', wsUrl);
    const ws = new WebSocket(wsUrl);
    wsRef.current = ws;

    ws.onopen = () => {
      console.log('WebSocket connected');
      setIsConnected(true);
      
      // Set username for anonymous chat
      if (username) {
        ws.send(JSON.stringify({
          type: 'set_username',
          username: username
        }));
      }
    };

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      
      switch (data.type) {
        case 'username_set':
          console.log('Username set:', data.username);
          // Join the current room if one is selected
          if (currentRoomRef.current) {
            ws.send(JSON.stringify({
              type: 'join_room',
              roomId: currentRoomRef.current
            }));
          }
          break;
          
        case 'error':
          console.error('WebSocket error:', data.message);
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
          
        case 'match_found':
          console.log('Match found via WebSocket:', data);
          if (onMatchFound) {
            onMatchFound({ room: data.room, matchedUser: data.matchedUser });
          }
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
      console.error('Failed to connect to:', wsUrl);
      setIsConnected(false);
    };

    return () => {
      ws.close();
    };
  }, [username, onMatchFound]);

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
