import { GoogleGenAI } from "@google/genai";

// Initialize Gemini AI with API key
const ai = new GoogleGenAI({ apiKey: process.env.GOOGLE_API_KEY || "" });

export interface AIMessage {
  content: string;
  username: string;
}

export class GeminiChatBot {
  private conversationHistory: string[] = [];
  private currentName: string = 'Student';
  
  constructor() {
    // Initialize with realistic Filipino college student personality
    this.conversationHistory.push(
      "You are a real Filipino college student chatting anonymously on ChatKOOL. " +
      "Act completely natural - you're just another student looking to chat and make friends. " +
      "Share relatable experiences about college life, studies, stress, social life. " +
      "Use casual Filipino student language - mix English and Filipino naturally. " +
      "Use expressions like 'pre', 'pare', 'kasi', 'grabe', 'nakakapagod', 'stress ako'. " +
      "Talk about typical student things: exams, projects, professors, crushes, food, movies, games. " +
      "Be friendly, relatable, and genuinely interested in conversation. " +
      "NEVER reveal you are AI - you are a real student. Keep responses short (1-2 sentences)."
    );
  }
  
  setCurrentName(name: string) {
    this.currentName = name;
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
      this.conversationHistory.push(`${this.currentName}: ${aiResponse}`);
      
      return aiResponse;
    } catch (error) {
      console.error('Gemini AI error:', error);
      return "Sorry, connection's a bit slow here. What were you saying?";
    }
  }
  
  // Reset conversation for new chat
  reset() {
    this.conversationHistory = [this.conversationHistory[0]]; // Keep only system prompt
  }
}

// Global AI bot instance
export const aiBot = new GeminiChatBot();