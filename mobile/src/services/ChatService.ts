import { MatchResponse, AIResponse } from '../types';

export class ChatService {
  private baseUrl: string;

  constructor() {
    // Use localhost for development, update for production
    this.baseUrl = 'http://localhost:5000/api';
  }

  async findRandomMatch(username: string): Promise<MatchResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/random-chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error finding match:', error);
      throw error;
    }
  }

  async sendAIMessage(
    message: string, 
    username: string, 
    aiName: string,
    isFirstMessage: boolean = false
  ): Promise<AIResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/ai-chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          message, 
          username, 
          aiName,
          isFirstMessage 
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error sending AI message:', error);
      throw error;
    }
  }

  // Health check method
  async checkHealth(): Promise<boolean> {
    try {
      const response = await fetch(`${this.baseUrl}/health`);
      return response.ok;
    } catch (error) {
      console.error('Health check failed:', error);
      return false;
    }
  }
}