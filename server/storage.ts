import { 
  type User, 
  type InsertUser, 
  type Message,
  type InsertMessage,
  type MessageWithUser,
  type ChatRoom,
  type InsertRoom,
  type RoomMember,
  type LoginData
} from "@shared/schema";
import { randomUUID } from "crypto";
import bcrypt from "bcryptjs";

export interface IStorage {
  // User operations
  getUser(id: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  validateUser(email: string, password: string): Promise<User | null>;
  
  // Room operations
  getAllRooms(): Promise<ChatRoom[]>;
  getRoomsByType(type: string): Promise<ChatRoom[]>;
  getRoomsByUniversity(university: string): Promise<ChatRoom[]>;
  getRoom(id: string): Promise<ChatRoom | undefined>;
  createRoom(room: InsertRoom): Promise<ChatRoom>;
  joinRoom(userId: string, roomId: string): Promise<void>;
  
  // Message operations
  getMessagesByRoom(roomId: string, limit?: number): Promise<MessageWithUser[]>;
  createMessage(message: InsertMessage): Promise<MessageWithUser>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private rooms: Map<string, ChatRoom>;
  private messages: Map<string, Message>;
  private roomMembers: Map<string, RoomMember>;

  constructor() {
    this.users = new Map();
    this.rooms = new Map();
    this.messages = new Map();
    this.roomMembers = new Map();
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
        description: roomData.description,
        type: roomData.type,
        university: roomData.university,
        memberCount: 0,
        createdAt: new Date()
      };
      this.rooms.set(room.id, room);
    }
  }

  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(user => user.email === email);
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const hashedPassword = await bcrypt.hash(insertUser.password, 12);
    const id = randomUUID();
    const user: User = {
      id,
      username: insertUser.username,
      email: insertUser.email,
      password: hashedPassword,
      fullName: insertUser.fullName,
      university: insertUser.university,
      isVerified: true, // Auto-verify for demo
      createdAt: new Date()
    };
    this.users.set(id, user);
    return user;
  }

  async validateUser(email: string, password: string): Promise<User | null> {
    const user = await this.getUserByEmail(email);
    if (!user) return null;
    
    const isValid = await bcrypt.compare(password, user.password);
    return isValid ? user : null;
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

  async joinRoom(userId: string, roomId: string): Promise<void> {
    const membershipId = randomUUID();
    const membership: RoomMember = {
      id: membershipId,
      userId,
      roomId,
      joinedAt: new Date()
    };
    this.roomMembers.set(membershipId, membership);

    // Update member count
    const room = this.rooms.get(roomId);
    if (room) {
      room.memberCount = room.memberCount + 1;
      this.rooms.set(roomId, room);
    }
  }

  async getMessagesByRoom(roomId: string, limit: number = 50): Promise<MessageWithUser[]> {
    const roomMessages = Array.from(this.messages.values())
      .filter(msg => msg.roomId === roomId)
      .sort((a, b) => a.createdAt!.getTime() - b.createdAt!.getTime())
      .slice(-limit);

    return roomMessages.map(msg => {
      const user = this.users.get(msg.userId);
      return {
        ...msg,
        user: user ? {
          id: user.id,
          username: user.username,
          fullName: user.fullName
        } : {
          id: 'unknown',
          username: 'Unknown User',
          fullName: 'Unknown User'
        }
      };
    });
  }

  async createMessage(insertMessage: InsertMessage): Promise<MessageWithUser> {
    const id = randomUUID();
    const message: Message = {
      id,
      ...insertMessage,
      createdAt: new Date()
    };
    this.messages.set(id, message);

    const user = this.users.get(message.userId);
    return {
      ...message,
      user: user ? {
        id: user.id,
        username: user.username,
        fullName: user.fullName
      } : {
        id: 'unknown',
        username: 'Unknown User',
        fullName: 'Unknown User'
      }
    };
  }
}

export const storage = new MemStorage();
