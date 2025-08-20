export interface ChatMessage {
  id: string;
  content: string;
  username: string;
  createdAt: string;
}

export interface ChatRoom {
  id: string;
  participants: string[];
}

export interface ApiResponse<T> {
  data?: T;
  message?: string;
  error?: string;
}

export interface MatchResponse {
  matched: boolean;
  message: string;
  room?: ChatRoom;
  user?: string;
}

export interface AIResponse {
  response: string;
}

export type ConnectionStatus = 'disconnected' | 'connecting' | 'connected' | 'error';