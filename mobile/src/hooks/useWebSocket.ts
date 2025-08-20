import { useState, useEffect, useRef, useCallback } from 'react';
import { ChatMessage, ConnectionStatus } from '../types';

interface WebSocketConfig {
  onMessage?: (message: ChatMessage) => void;
  onUserJoined?: (username: string) => void;
  onUserLeft?: () => void;
  onConnectionChange?: (status: ConnectionStatus) => void;
}

export function useWebSocket(username: string, config: WebSocketConfig = {}) {
  const [connectionStatus, setConnectionStatus] = useState<ConnectionStatus>('disconnected');
  const wsRef = useRef<WebSocket | null>(null);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const reconnectAttempts = useRef(0);
  const maxReconnectAttempts = 5;

  const updateConnectionStatus = useCallback((status: ConnectionStatus) => {
    setConnectionStatus(status);
    config.onConnectionChange?.(status);
  }, [config]);

  const connect = useCallback(() => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      return;
    }

    updateConnectionStatus('connecting');
    
    // Use localhost for development, update for production
    const wsUrl = 'ws://localhost:5000/ws';
    
    try {
      const ws = new WebSocket(wsUrl);
      wsRef.current = ws;

      ws.onopen = () => {
        console.log('WebSocket connected');
        updateConnectionStatus('connected');
        reconnectAttempts.current = 0;
        
        // Send initial connection message
        ws.send(JSON.stringify({
          type: 'join',
          username,
        }));
      };

      ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          
          switch (data.type) {
            case 'message':
              if (data.message) {
                config.onMessage?.(data.message);
              }
              break;
              
            case 'user_joined':
              if (data.username && data.username !== username) {
                config.onUserJoined?.(data.username);
              }
              break;
              
            case 'user_left':
              config.onUserLeft?.();
              break;
              
            default:
              console.log('Unknown message type:', data.type);
          }
        } catch (error) {
          console.error('Error parsing WebSocket message:', error);
        }
      };

      ws.onerror = (error) => {
        console.error('WebSocket error:', error);
        updateConnectionStatus('error');
      };

      ws.onclose = () => {
        console.log('WebSocket closed');
        updateConnectionStatus('disconnected');
        
        // Attempt to reconnect if not intentionally closed
        if (reconnectAttempts.current < maxReconnectAttempts) {
          reconnectAttempts.current++;
          reconnectTimeoutRef.current = setTimeout(() => {
            console.log(`Reconnect attempt ${reconnectAttempts.current}`);
            connect();
          }, 3000 * reconnectAttempts.current); // Exponential backoff
        }
      };
      
    } catch (error) {
      console.error('Error creating WebSocket:', error);
      updateConnectionStatus('error');
    }
  }, [username, config, updateConnectionStatus]);

  const disconnect = useCallback(() => {
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
      reconnectTimeoutRef.current = null;
    }
    
    if (wsRef.current) {
      wsRef.current.close();
      wsRef.current = null;
    }
    
    updateConnectionStatus('disconnected');
    reconnectAttempts.current = maxReconnectAttempts; // Prevent reconnection
  }, [updateConnectionStatus]);

  const sendMessage = useCallback((content: string) => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      const message = {
        type: 'message',
        content,
        username,
      };
      
      wsRef.current.send(JSON.stringify(message));
      return true;
    }
    
    return false;
  }, [username]);

  // Connect on mount
  useEffect(() => {
    connect();
    
    return () => {
      disconnect();
    };
  }, [connect, disconnect]);

  return {
    connectionStatus,
    sendMessage,
    disconnect,
    reconnect: connect,
  };
}