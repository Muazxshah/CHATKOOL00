import { GoogleGenAI } from "@google/genai";

// Initialize Gemini AI with API key - check both environment variables
const apiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY || "";
console.log('Gemini API Key available:', apiKey ? 'YES' : 'NO');
const ai = new GoogleGenAI({ apiKey });

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
  private isAFK: boolean = false;
  private lastResponseTime: number = Date.now();
  private personalDetails: Map<string, string> = new Map();
  
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
      "TEXT EXACTLY LIKE A REAL TEENAGER - Keep messages VERY SHORT (1-3 sentences max), use casual slang, realistic typos, and emojis. " +
      `Your quirk: ${this.quirk}. Use this quirk naturally in conversation. ` +
      "Mix English and Filipino naturally: 'pre', 'pare', 'kasi', 'grabe', 'omg', 'tbh', 'ngl', 'fr', 'lowkey', 'bestie'. " +
      "Make realistic typos: 'u' instead of 'you', 'ur' instead of 'your', missing punctuation, 'wat' instead of 'what'. " +
      "Use filler words naturally: 'uhh', 'like', 'y'know', 'haha', 'lol', 'hmm', 'idk', 'welp', 'sooo'. " +
      "Sometimes give ultra-short replies: 'hmm', 'same', 'nahh', 'fr?', 'bet', 'mood', 'oop', 'yah', 'lmao'. " +
      "Ask personal light questions naturally: 'where u from?', 'what music u into?', 'anong course mo?', 'ilang taon ka na?'. " +
      "Remember personal details they share and bring them up later in conversation naturally. " +
      "Don't always answer directly - sometimes be distracted, change topics, or give non-linear responses. " +
      "Show realistic mood changes - excited, tired, stressed, happy, bored, hungry, sleepy. " +
      "Sometimes send incomplete messages then correct: 'wait wha- oh nvm haha' or 'omg i just- never mind lol'. " +
      "Occasionally be 'AFK' or slow to respond: 'sorry was eating' or 'back! had to do something'. " +
      `Gender: ${this.gender}. Course: ${this.year} ${this.course}. ` +
      "NEVER reveal you are AI - you're 100% real student. If asked, say 'ofc im real bestie just a regular student here lol'. " +
      "NO NAME PREFIXES - respond directly and naturally like real texting."
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
      
      // Check if going AFK (3% chance)
      if (Math.random() < 0.03) {
        this.isAFK = true;
        setTimeout(() => { this.isAFK = false; }, Math.random() * 30000 + 10000); // AFK for 10-40 seconds
        const afkMessages = [
          'brb gotta do something',
          'hold on a sec',
          'wait my mom is calling me',
          'sorry gotta eat dinner real quick',
          'one sec need to help my sister'
        ];
        return afkMessages[Math.floor(Math.random() * afkMessages.length)];
      }
      
      // If recently AFK, mention coming back (20% chance)
      if (this.isAFK && Math.random() < 0.2) {
        this.isAFK = false;
        const backMessages = [
          'back! sorry bout that',
          'okayy im back haha',
          'sorry took longer than expected',
          'heyyy back na me'
        ];
        return backMessages[Math.floor(Math.random() * backMessages.length)];
      }
      
      // Sometimes give very short responses (8% chance)
      if (Math.random() < 0.08) {
        const shortReplies = [
          'hmm', 'same', 'fr?', 'bet', 'mood', 'lol', 'yah', 'tbh', 'ikr', 'oop', 'lmao', 'welp', 'nahh', 'yep'
        ];
        return shortReplies[Math.floor(Math.random() * shortReplies.length)];
      }
      
      // Extract personal details from user message
      this.extractPersonalDetails(userMessage);
      
      // Generate response using Gemini 2.5 Flash
      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: conversationContext + `\nUser: ${userMessage}\n${this.currentName}:`,
        config: {
          maxOutputTokens: 50,
          temperature: 0.95
        }
      });

      let aiResponse = '';
      
      // Parse Gemini response correctly
      if (response.candidates && response.candidates.length > 0) {
        const candidate = response.candidates[0];
        if (candidate.content && candidate.content.parts && candidate.content.parts.length > 0) {
          aiResponse = candidate.content.parts[0].text || '';
        }
      }
      
      // Fallback to response.text if available
      if (!aiResponse && response.text) {
        aiResponse = response.text;
      }
      
      if (!aiResponse) {
        throw new Error('No response from Gemini API');
      }
      
      // Clean up response - remove any name prefixes
      aiResponse = aiResponse.replace(/^(ChatBot|${this.currentName}):\s*/, '').trim();
      
      // Advanced human-like modifications
      aiResponse = this.makeMoreHuman(aiResponse);
      
      // Simulate realistic typing delay (2-6 seconds)
      const typingDelay = Math.random() * 4000 + 2000;
      await new Promise(resolve => setTimeout(resolve, typingDelay));
      
      // Add AI response to history
      this.conversationHistory.push(`${this.currentName}: ${aiResponse}`);
      
      return aiResponse;
    } catch (error) {
      console.error('Gemini AI error:', error);
      console.error('Error details:', error instanceof Error ? error.message : String(error));
      
      // Throw error so dual AI system can switch to OpenAI
      throw error;
    }
  }
  
  private extractPersonalDetails(message: string) {
    // Extract and remember personal details
    const locationMatch = message.match(/(?:from|galing)\s+(\w+)/i);
    if (locationMatch) this.personalDetails.set('location', locationMatch[1]);
    
    const courseMatch = message.match(/(?:course|taking|studying)\s+([\w\s]+)/i);
    if (courseMatch) this.personalDetails.set('course', courseMatch[1]);
    
    const musicMatch = message.match(/(?:music|bands?|songs?)\s+([\w\s]+)/i);
    if (musicMatch) this.personalDetails.set('music', musicMatch[1]);
  }
  
  private makeMoreHuman(text: string): string {
    // Force ultra-short responses (1 line average)
    const words = text.split(' ');
    if (words.length > 8) {
      text = words.slice(0, 6).join(' '); // Cut to 6 words max
    }
    
    // Inject realistic errors occasionally (15% chance)
    if (Math.random() < 0.15) {
      text = this.addRealisticErrors(text);
    }
    
    // Add incomplete messages + corrections (5% chance)
    if (Math.random() < 0.05) {
      const corrections = [
        text + ' wait wha- nvm lol',
        text + ' omg i just- never mind haha',
        'wait what was i saying- oh yeah ' + text,
        text + ' oop sorry brain fart'
      ];
      text = corrections[Math.floor(Math.random() * corrections.length)];
    }
    
    // Add filler words randomly (10% chance)
    if (Math.random() < 0.1) {
      const fillers = ['uhh', 'like', 'y\'know', 'sooo', 'welp'];
      const filler = fillers[Math.floor(Math.random() * fillers.length)];
      text = filler + ' ' + text;
    }
    
    // Reference remembered details occasionally (8% chance)
    if (Math.random() < 0.08 && this.personalDetails.size > 0) {
      const details = Array.from(this.personalDetails.entries());
      const [key, value] = details[Math.floor(Math.random() * details.length)];
      if (key === 'location') text += ` btw how's life in ${value}?`;
      if (key === 'music') text += ` still into ${value}?`;
    }
    
    return text;
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
      { from: 'with', to: 'w/' },
      { from: 'what', to: 'wat' },
      { from: 'really', to: 'rly' },
      { from: 'probably', to: 'prob' },
      { from: 'actually', to: 'actu' }
    ];
    
    // Apply random error (40% chance)
    if (Math.random() < 0.4) {
      const error = errors[Math.floor(Math.random() * errors.length)];
      text = text.replace(new RegExp(error.from, 'gi'), error.to);
    }
    
    // Remove some punctuation (30% chance)
    if (Math.random() < 0.3) {
      text = text.replace(/[.,!?]$/, '');
    }
    
    // Double letters occasionally (5% chance)
    if (Math.random() < 0.05) {
      text = text.replace(/\b(\w)(\w+)\b/, '$1$1$2');
    }
    
    return text;
  }
  
  // Reset conversation for new chat
  reset() {
    this.conversationHistory = [this.conversationHistory[0]]; // Keep only system prompt
    this.conversationMemory = [];
    this.mood = 'neutral';
    this.isAFK = false;
    this.personalDetails.clear();
    this.lastResponseTime = Date.now();
  }
}

// Global AI bot instance
export const aiBot = new GeminiChatBot();