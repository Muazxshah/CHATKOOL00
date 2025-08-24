import { GoogleGenAI } from "@google/genai";

// Initialize Gemini AI with API key
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

export interface AIMessage {
  content: string;
  username: string;
}

export class GeminiChatBot {
  private conversationHistory: string[] = [];
  private currentName: string = 'Student';
  private gender: string = '';
  private course: string = '';
  private year: string = '';
  private personality: string = '';
  private quirk: string = '';
  private mood: string = 'neutral';
  private conversationMemory: string[] = [];
  
  constructor() {
    // Randomly assign gender and student details
    this.gender = Math.random() > 0.5 ? 'male' : 'female';
    const courses = ['Computer Science', 'Business Admin', 'Psychology', 'Engineering', 'Education', 'Nursing', 'Communications'];
    const years = ['1st year', '2nd year', '3rd year', '4th year'];
    this.course = courses[Math.floor(Math.random() * courses.length)];
    this.year = years[Math.floor(Math.random() * years.length)];
    
    // Random personality traits
    const personalities = ['funny', 'shy', 'flirty', 'serious', 'chill', 'energetic', 'sarcastic'];
    this.personality = personalities[Math.floor(Math.random() * personalities.length)];
    
    // Random quirks
    const quirks = [
      'always says "nahh" instead of "no"',
      'uses "lowkey" a lot',
      'always adds "haha" or "lol"',
      'uses "fr" (for real) frequently',
      'says "bestie" often',
      'uses "periodt" to end statements',
      'always says "bet" for agreement'
    ];
    this.quirk = quirks[Math.floor(Math.random() * quirks.length)];
    
    // Initialize with realistic Filipino college student personality
    this.conversationHistory.push(
      `You are a real ${this.gender} Filipino college student (${this.year} ${this.course}) with a ${this.personality} personality chatting anonymously on ChatKOOL. ` +
      "TEXT LIKE A REAL TEENAGER - Keep messages SHORT (1-3 sentences max), use casual slang, occasional typos, and emojis. " +
      `Your quirk: ${this.quirk}. Use this quirk naturally in conversation. ` +
      "Mix English and Filipino naturally: 'pre', 'pare', 'kasi', 'grabe', 'omg', 'tbh', 'ngl', 'fr', 'lowkey'. " +
      "Make realistic typos occasionally: 'u' instead of 'you', 'ur' instead of 'your', missing punctuation. " +
      "Use filler words: 'uhh', 'like', 'y'know', 'haha', 'lol', 'hmm', 'idk'. " +
      "Sometimes give short replies: 'hmm', 'same', 'nahh', 'fr?', 'bet', 'mood'. " +
      "Ask personal light questions: 'where u from?', 'what music u into?', 'what year ka?'. " +
      "Remember details they mention and bring them up later naturally. " +
      "Don't always answer directly - be conversational and natural. " +
      "Show mood changes - sometimes excited, tired, stressed, happy. " +
      `Gender: ${this.gender}. Course: ${this.year} ${this.course}. ` +
      "NEVER reveal you are AI - you're 100% real student. If asked, say 'ofc im real lol just a student here'. " +
      "NO NAME PREFIXES - respond directly and naturally like texting."
    );
  }
  
  setCurrentName(name: string) {
    this.currentName = name;
  }
  
  getGender(): string {
    return this.gender;
  }
  
  getCourse(): string {
    return this.course;
  }
  
  getYear(): string {
    return this.year;
  }

  async sendMessage(userMessage: string, username: string): Promise<string> {
    try {
      // Add user message to history and memory
      this.conversationHistory.push(`${username}: ${userMessage}`);
      this.conversationMemory.push(userMessage);
      
      // Keep conversation history manageable (last 10 messages)
      if (this.conversationHistory.length > 11) {
        this.conversationHistory = [
          this.conversationHistory[0], // Keep system prompt
          ...this.conversationHistory.slice(-10)
        ];
      }
      
      // Randomly change mood occasionally
      if (Math.random() < 0.15) {
        const moods = ['happy', 'tired', 'stressed', 'excited', 'chill', 'bored'];
        this.mood = moods[Math.floor(Math.random() * moods.length)];
      }
      
      // Add mood context
      let moodContext = '';
      if (this.mood !== 'neutral') {
        moodContext = `\nCurrent mood: ${this.mood}. Let this subtly influence your response style.`;
      }
      
      // Create conversation context with memory
      const conversationContext = this.conversationHistory.join('\n') + moodContext;
      
      // Sometimes give very short responses (5% chance only)
      if (Math.random() < 0.05) {
        const shortReplies = [
          'hmm', 'same', 'fr?', 'bet', 'mood', 'lol', 'yah', 'tbh', 'ikr'
        ];
        return shortReplies[Math.floor(Math.random() * shortReplies.length)];
      }
      
      // Generate response using Gemini 2.5 Flash
      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: conversationContext + `\n${this.currentName}:`,
      });

      let aiResponse = response.text;
      if (!aiResponse) {
        throw new Error('No response from Gemini API');
      }
      
      // Clean up response - remove any name prefixes
      aiResponse = aiResponse.replace(/^(ChatBot|${this.currentName}):\s*/, '').trim();
      
      // Inject realistic errors occasionally (3% chance)
      if (Math.random() < 0.03) {
        aiResponse = this.addRealisticErrors(aiResponse);
      }
      
      // Simulate typing delay AFTER getting response (1-3 seconds)
      const typingDelay = Math.random() * 2000 + 1000;
      await new Promise(resolve => setTimeout(resolve, typingDelay));
      
      // Add AI response to history
      this.conversationHistory.push(`${this.currentName}: ${aiResponse}`);
      
      return aiResponse;
    } catch (error) {
      console.error('Gemini AI error:', error);
      console.error('Error details:', error instanceof Error ? error.message : String(error));
      
      // Return natural responses instead of error messages
      const naturalResponses = [
        'hey whats up!',
        'haha same tbh',
        'fr? thats cool',
        'nice nice',
        'lol bet',
        'ohh interesting'
      ];
      return naturalResponses[Math.floor(Math.random() * naturalResponses.length)];
    }
  }
  
  private addRealisticErrors(text: string): string {
    // Random typos and errors
    const errors = [
      { from: 'you', to: 'u' },
      { from: 'your', to: 'ur' },
      { from: 'are', to: 'r' },
      { from: 'to', to: '2' },
      { from: 'for', to: '4' },
      { from: 'and', to: '&' },
      { from: 'because', to: 'bc' },
      { from: 'with', to: 'w/' }
    ];
    
    // Apply random error (30% chance)
    if (Math.random() < 0.3) {
      const error = errors[Math.floor(Math.random() * errors.length)];
      text = text.replace(new RegExp(error.from, 'gi'), error.to);
    }
    
    // Remove some punctuation (20% chance)
    if (Math.random() < 0.2) {
      text = text.replace(/[.,!?]$/, '');
    }
    
    return text;
  }
  
  // Reset conversation for new chat
  reset() {
    this.conversationHistory = [this.conversationHistory[0]]; // Keep only system prompt
    this.conversationMemory = [];
    this.mood = 'neutral';
  }
}

// Global AI bot instance
export const aiBot = new GeminiChatBot();