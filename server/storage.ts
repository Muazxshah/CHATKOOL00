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

  private async initializeDefaultRooms() {
    const defaultRooms = [
      {
        name: "UP Diliman",
        description: "University of the Philippines Diliman students",
        type: "university",
        university: "University of the Philippines"
      },
      {
        name: "Ateneo",
        description: "Ateneo de Manila University students",
        type: "university", 
        university: "Ateneo de Manila University"
      },
      {
        name: "UST",
        description: "University of Santo Tomas students",
        type: "university",
        university: "University of Santo Tomas"
      },
      {
        name: "DLSU",
        description: "De La Salle University students",
        type: "university",
        university: "De La Salle University"
      },
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
      }
    ];

    for (const roomData of defaultRooms) {
      const room: ChatRoom = {
        id: randomUUID(),
        name: roomData.name,
        description: roomData.description || null,
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
