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
}

export class MemStorage implements IStorage {
  private rooms: Map<string, ChatRoom>;
  private messages: Map<string, Message>;

  constructor() {
    this.rooms = new Map();
    this.messages = new Map();
    this.initializeDefaultRooms();
  }

  private initializeDefaultRooms() {
    const defaultRooms = [
      {
        name: "Math Help",
        description: "Get help with mathematics subjects",
        type: "study_group",
        university: null
      },
      {
        name: "CS Students",
        description: "Computer Science students discussion",
        type: "study_group", 
        university: null
      },
      {
        name: "Engineering",
        description: "Engineering students and projects",
        type: "study_group",
        university: null
      },
      {
        name: "Business & Finance",
        description: "Business, economics, and finance discussions",
        type: "study_group",
        university: null
      },
      {
        name: "Science",
        description: "Physics, chemistry, biology discussions",
        type: "study_group",
        university: null
      },
      {
        name: "General Chat",
        description: "General discussions and casual conversations",
        type: "general",
        university: null
      }
    ];

    for (const roomData of defaultRooms) {
      const room: ChatRoom = {
        id: randomUUID(),
        name: roomData.name,
        description: roomData.description,
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
}

export const storage = new MemStorage();
