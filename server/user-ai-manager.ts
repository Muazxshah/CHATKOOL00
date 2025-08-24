import { GeminiChatBot } from './gemini';
import { OpenAIChatBot } from './openai';

interface UserAIBots {
  gemini: GeminiChatBot;
  openai: OpenAIChatBot;
  preferredModel: 'gemini' | 'openai';
  lastActivity: number;
}

export class UserAIManager {
  private userBots: Map<string, UserAIBots> = new Map();
  
  // Clean up inactive users (older than 30 minutes)
  private cleanupInterval = setInterval(() => {
    const thirtyMinutesAgo = Date.now() - 30 * 60 * 1000;
    const entries = Array.from(this.userBots.entries());
    for (const [username, bots] of entries) {
      if (bots.lastActivity < thirtyMinutesAgo) {
        this.userBots.delete(username);
        console.log(`Cleaned up AI bots for inactive user: ${username}`);
      }
    }
  }, 5 * 60 * 1000); // Run every 5 minutes
  
  private getUserBots(username: string): UserAIBots {
    let userBots = this.userBots.get(username);
    
    if (!userBots) {
      // Create fresh AI instances for this user
      userBots = {
        gemini: new GeminiChatBot(),
        openai: new OpenAIChatBot(),
        preferredModel: 'gemini',
        lastActivity: Date.now()
      };
      this.userBots.set(username, userBots);
      console.log(`Created fresh AI bots for user: ${username}`);
    } else {
      // Update last activity
      userBots.lastActivity = Date.now();
    }
    
    return userBots;
  }
  
  setCurrentName(username: string, aiName: string) {
    const bots = this.getUserBots(username);
    bots.gemini.setCurrentName(aiName);
    bots.openai.setCurrentName(aiName);
  }
  
  getGender(username: string): string {
    const bots = this.getUserBots(username);
    return bots.preferredModel === 'gemini' ? bots.gemini.getGender() : bots.openai.getGender();
  }
  
  getCourse(username: string): string {
    const bots = this.getUserBots(username);
    return bots.preferredModel === 'gemini' ? bots.gemini.getCourse() : bots.openai.getCourse();
  }
  
  getYear(username: string): string {
    const bots = this.getUserBots(username);
    return bots.preferredModel === 'gemini' ? bots.gemini.getYear() : bots.openai.getYear();
  }

  async sendMessage(username: string, userMessage: string): Promise<string> {
    const bots = this.getUserBots(username);
    
    // Try Gemini first (primary)
    try {
      console.log(`Trying Gemini API for user ${username}...`);
      const response = await bots.gemini.sendMessage(userMessage, username);
      console.log(`✅ Gemini API success for user ${username}`);
      bots.preferredModel = 'gemini';
      return response;
    } catch (geminiError) {
      console.log(`❌ Gemini API failed for user ${username}, switching to OpenAI...`);
      console.error('Gemini error:', geminiError instanceof Error ? geminiError.message : String(geminiError));
      
      // Fallback to OpenAI
      try {
        const response = await bots.openai.sendMessage(userMessage, username);
        console.log(`✅ OpenAI API success (fallback) for user ${username}`);
        bots.preferredModel = 'openai';
        return response;
      } catch (openaiError) {
        console.log(`❌ Both APIs failed for user ${username}, using manual fallback`);
        console.error('OpenAI error:', openaiError instanceof Error ? openaiError.message : String(openaiError));
        
        // Manual fallback responses if both fail
        const manualFallbacks = [
          'hey whats up!',
          'haha same tbh', 
          'fr? thats cool',
          'nice nice bestie',
          'lol bet',
          'ohh interesting',
          'grabe naman haha',
          'uy kamusta ka?',
          'chill lang pre'
        ];
        return manualFallbacks[Math.floor(Math.random() * manualFallbacks.length)];
      }
    }
  }
  
  // Reset user's conversation for new chat
  resetUser(username: string) {
    const bots = this.getUserBots(username);
    bots.gemini.reset();
    bots.openai.reset();
    bots.preferredModel = 'gemini';
    console.log(`Reset AI conversation for user: ${username}`);
  }
  
  // Remove user's bots (when they disconnect)
  removeUser(username: string) {
    this.userBots.delete(username);
    console.log(`Removed AI bots for user: ${username}`);
  }
}

// Global user AI manager instance
export const userAIManager = new UserAIManager();