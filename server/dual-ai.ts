import { aiBot as geminiBot } from './gemini';
import { openaiBot } from './openai';

export class DualAIChatBot {
  private currentName: string = 'Student';
  private preferredModel: 'gemini' | 'openai' = 'gemini';
  
  setCurrentName(name: string) {
    this.currentName = name;
    geminiBot.setCurrentName(name);
    openaiBot.setCurrentName(name);
  }
  
  getGender(): string {
    return this.preferredModel === 'gemini' ? geminiBot.getGender() : openaiBot.getGender();
  }
  
  getCourse(): string {
    return this.preferredModel === 'gemini' ? geminiBot.getCourse() : openaiBot.getCourse();
  }
  
  getYear(): string {
    return this.preferredModel === 'gemini' ? geminiBot.getYear() : openaiBot.getYear();
  }

  async sendMessage(userMessage: string, username: string): Promise<string> {
    // Try Gemini first (primary)
    try {
      console.log('Trying Gemini API...');
      const response = await geminiBot.sendMessage(userMessage, username);
      console.log('✅ Gemini API success');
      this.preferredModel = 'gemini';
      return response;
    } catch (geminiError) {
      console.log('❌ Gemini API failed, switching to OpenAI...');
      console.error('Gemini error:', geminiError instanceof Error ? geminiError.message : String(geminiError));
      
      // Fallback to OpenAI
      try {
        const response = await openaiBot.sendMessage(userMessage, username);
        console.log('✅ OpenAI API success (fallback)');
        this.preferredModel = 'openai';
        return response;
      } catch (openaiError) {
        console.log('❌ Both APIs failed, using manual fallback');
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
  
  // Reset both bots for new chat
  reset() {
    geminiBot.reset();
    openaiBot.reset();
    this.preferredModel = 'gemini';
  }
}

// Global dual AI bot instance
export const dualAIBot = new DualAIChatBot();