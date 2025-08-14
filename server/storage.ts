import { 
  type User, 
  type UserEntry, 
  type Message,
  type InsertMessage,
  type MessageWithUser,
  type ChatRoom,
  type InsertRoom,
  type RoomMember
} from "@shared/schema";
import { randomUUID } from "crypto";
export interface IStorage {
  // Room operations
  getAllRooms(): Promise<ChatRoom[]>;
  getRoomsByType(type: string): Promise<ChatRoom[]>;
  getRoomsByUniversity(university: string): Promise<ChatRoom[]>;
  getRoom(id: string): Promise<ChatRoom | undefined>;
  createRoom(room: InsertRoom): Promise<ChatRoom>;
  
  // Message operations - simplified for anonymous chat
  getMessagesByRoom(roomId: string, limit?: number): Promise<MessageWithUser[]>;
  createMessage(message: InsertMessage): Promise<MessageWithUser>;
  
  // Online users and matching
  addOnlineUser(username: string): Promise<void>;
  removeOnlineUser(username: string): Promise<void>;
  getOnlineUsers(): Promise<string[]>;
  findRandomMatch(currentUser: string): Promise<{ matchedUser: string; room: ChatRoom } | null>;
  createDirectRoom(user1: string, user2: string): Promise<ChatRoom>;
}

export class MemStorage implements IStorage {
  private rooms: Map<string, ChatRoom>;
  private messages: Map<string, Message>;
  private onlineUsers: Set<string>;
  private waitingForMatch: Set<string>;

  constructor() {
    this.rooms = new Map();
    this.messages = new Map();
    this.onlineUsers = new Set();
    this.waitingForMatch = new Set();
    this.initializeDefaultRooms();
  }

  private initializeDefaultRooms() {
    const defaultRooms = [
      {
        name: "Random Chat",
        description: "Connect with random Filipino college students",
        type: "random",
        university: null
      }
    ];

    for (const roomData of defaultRooms) {
      const room: ChatRoom = {
        id: randomUUID(),
        name: roomData.name,
        description: roomData.description ?? null,
        type: roomData.type,
        university: roomData.university,
        memberCount: 0,
        createdAt: new Date()
      };
      this.rooms.set(room.id, room);
    }
  }

  async getAllRooms(): Promise<ChatRoom[]> {
    return Array.from(this.rooms.values());
  }

  async getRoomsByType(type: string): Promise<ChatRoom[]> {
    return Array.from(this.rooms.values()).filter(room => room.type === type);
  }

  async getRoomsByUniversity(university: string): Promise<ChatRoom[]> {
    return Array.from(this.rooms.values()).filter(room => room.university === university);
  }

  async getRoom(id: string): Promise<ChatRoom | undefined> {
    return this.rooms.get(id);
  }

  async createRoom(insertRoom: InsertRoom): Promise<ChatRoom> {
    const id = randomUUID();
    const room: ChatRoom = {
      id,
      ...insertRoom,
      memberCount: 0,
      createdAt: new Date()
    };
    this.rooms.set(id, room);
    return room;
  }

  async getMessagesByRoom(roomId: string, limit: number = 50): Promise<MessageWithUser[]> {
    const roomMessages = Array.from(this.messages.values())
      .filter(msg => msg.roomId === roomId)
      .sort((a, b) => a.createdAt!.getTime() - b.createdAt!.getTime())
      .slice(-limit);

    return roomMessages.map(msg => ({
      ...msg,
      user: {
        username: msg.username
      }
    }));
  }

  async createMessage(insertMessage: InsertMessage): Promise<MessageWithUser> {
    const id = randomUUID();
    const message: Message = {
      id,
      ...insertMessage,
      createdAt: new Date()
    };
    this.messages.set(id, message);

    return {
      ...message,
      user: {
        username: message.username
      }
    };
  }

  async addOnlineUser(username: string): Promise<void> {
    this.onlineUsers.add(username);
  }

  async removeOnlineUser(username: string): Promise<void> {
    this.onlineUsers.delete(username);
    this.waitingForMatch.delete(username);
  }

  async getOnlineUsers(): Promise<string[]> {
    return Array.from(this.onlineUsers);
  }

  async findRandomMatch(currentUser: string): Promise<{ matchedUser: string; room: ChatRoom } | null> {
    console.log(`Finding match for ${currentUser}, waiting list:`, Array.from(this.waitingForMatch));
    
    // Find another user who is waiting (excluding current user)
    const availableUsers = Array.from(this.waitingForMatch).filter(user => user !== currentUser);
    
    if (availableUsers.length > 0) {
      // Pick random user
      const randomIndex = Math.floor(Math.random() * availableUsers.length);
      const matchedUser = availableUsers[randomIndex];
      
      console.log(`Match found: ${currentUser} <-> ${matchedUser}`);
      
      // Remove both users from waiting list
      this.waitingForMatch.delete(currentUser);
      this.waitingForMatch.delete(matchedUser);
      
      // Create room immediately for the match
      const room = await this.createDirectRoom(currentUser, matchedUser);
      
      return { matchedUser, room };
    }
    
    // Add current user to waiting list only if no match found
    this.waitingForMatch.add(currentUser);
    console.log(`No match for ${currentUser}, added to waiting list`);
    
    return null; // No match found, user stays in waiting list
  }

  async createDirectRoom(user1: string, user2: string): Promise<ChatRoom> {
    const roomId = randomUUID();
    const room: ChatRoom = {
      id: roomId,
      name: `${user1} & ${user2}`,
      description: `Direct chat between ${user1} and ${user2}`,
      type: "direct",
      university: null,
      memberCount: 2,
      createdAt: new Date()
    };
    this.rooms.set(roomId, room);
    return room;
  }
}

export const storage = new MemStorage();
