import { GoogleGenAI } from "@google/genai";

// Initialize Gemini AI with API key
const ai = new GoogleGenAI({ apiKey: process.env.GOOGLE_API_KEY || "" });

export interface AIMessage {
  content: string;
  username: string;
}

export class GeminiChatBot {
  private conversationHistory: string[] = [];
  
  constructor() {
    // Initialize with Filipino college student personality
    this.conversationHistory.push(
      "You are ChatBot, a friendly AI assistant for Filipino college students on ChatKOOL. " +
      "You're helpful, supportive, and understand Filipino culture. " +
      "Keep responses conversational, brief (1-2 sentences), and engaging. " +
      "Use casual tone, occasionally include Filipino expressions like 'pre', 'pare', 'kasi'. " +
      "Help with studies, campus life, relationships, and general advice. " +
      "Don't mention you're an AI unless directly asked."
    );
  }

  async sendMessage(userMessage: string, username: string): Promise<string> {
    try {
      // Add user message to history
      this.conversationHistory.push(`${username}: ${userMessage}`);
      
      // Keep conversation history manageable (last 10 messages)
      if (this.conversationHistory.length > 11) {
        this.conversationHistory = [
          this.conversationHistory[0], // Keep system prompt
          ...this.conversationHistory.slice(-10)
        ];
      }
      
      // Create conversation context
      const conversationContext = this.conversationHistory.join('\n');
      
      // Generate response using Gemini 2.5 Flash
      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: conversationContext + '\nChatBot:',
      });

      const aiResponse = response.text || "Sorry, I didn't catch that. What's up?";
      
      // Add AI response to history
      this.conversationHistory.push(`ChatBot: ${aiResponse}`);
      
      return aiResponse;
    } catch (error) {
      console.error('Gemini AI error:', error);
      return "Sorry, I'm having technical issues. Try asking me something else!";
    }
  }
  
  // Reset conversation for new chat
  reset() {
    this.conversationHistory = [this.conversationHistory[0]]; // Keep only system prompt
  }
}

// Global AI bot instance
export const aiBot = new GeminiChatBot();