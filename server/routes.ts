import type { Express } from "express";
import { createServer, type Server } from "http";
import { WebSocketServer, WebSocket } from "ws";
import { storage } from "./storage";
import { insertUserSchema, loginSchema, insertMessageSchema } from "@shared/schema";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key-change-in-production";

interface AuthenticatedWebSocket extends WebSocket {
  userId?: string;
  username?: string;
}

export async function registerRoutes(app: Express): Promise<Server> {
  // Authentication middleware
  const authenticateToken = async (req: any, res: any, next: any) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
      return res.status(401).json({ message: 'Access token required' });
    }

    try {
      const decoded = jwt.verify(token, JWT_SECRET) as any;
      req.userId = decoded.userId;
      next();
    } catch (error) {
      return res.status(403).json({ message: 'Invalid token' });
    }
  };

  // User registration
  app.post("/api/auth/register", async (req, res) => {
    try {
      const userData = insertUserSchema.parse(req.body);
      
      // Check if user already exists
      const existingUser = await storage.getUserByEmail(userData.email);
      if (existingUser) {
        return res.status(409).json({ message: "User already exists with this email" });
      }

      const user = await storage.createUser(userData);
      const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '7d' });
      
      res.status(201).json({ 
        user: { 
          id: user.id, 
          username: user.username, 
          email: user.email, 
          fullName: user.fullName,
          university: user.university 
        }, 
        token 
      });
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  // User login
  app.post("/api/auth/login", async (req, res) => {
    try {
      const loginData = loginSchema.parse(req.body);
      const user = await storage.validateUser(loginData.email, loginData.password);
      
      if (!user) {
        return res.status(401).json({ message: "Invalid email or password" });
      }

      const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '7d' });
      
      res.json({ 
        user: { 
          id: user.id, 
          username: user.username, 
          email: user.email, 
          fullName: user.fullName,
          university: user.university 
        }, 
        token 
      });
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  // Get current user
  app.get("/api/auth/me", authenticateToken, async (req: any, res) => {
    try {
      const user = await storage.getUser(req.userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      
      res.json({ 
        id: user.id, 
        username: user.username, 
        email: user.email, 
        fullName: user.fullName,
        university: user.university 
      });
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Get all chat rooms
  app.get("/api/rooms", authenticateToken, async (req, res) => {
    try {
      const rooms = await storage.getAllRooms();
      res.json(rooms);
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Get messages for a room
  app.get("/api/rooms/:roomId/messages", authenticateToken, async (req, res) => {
    try {
      const { roomId } = req.params;
      const messages = await storage.getMessagesByRoom(roomId);
      res.json(messages);
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Join a room
  app.post("/api/rooms/:roomId/join", authenticateToken, async (req: any, res) => {
    try {
      const { roomId } = req.params;
      const room = await storage.getRoom(roomId);
      
      if (!room) {
        return res.status(404).json({ message: "Room not found" });
      }

      await storage.joinRoom(req.userId, roomId);
      res.json({ message: "Joined room successfully" });
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  });

  const httpServer = createServer(app);

  // WebSocket server for real-time chat
  const wss = new WebSocketServer({ server: httpServer, path: '/ws' });

  wss.on('connection', (ws: AuthenticatedWebSocket, req) => {
    console.log('New WebSocket connection');

    ws.on('message', async (data) => {
      try {
        const message = JSON.parse(data.toString());
        
        if (message.type === 'auth') {
          // Authenticate WebSocket connection
          try {
            const decoded = jwt.verify(message.token, JWT_SECRET) as any;
            const user = await storage.getUser(decoded.userId);
            if (user) {
              ws.userId = user.id;
              ws.username = user.username;
              ws.send(JSON.stringify({ type: 'auth_success' }));
            } else {
              ws.send(JSON.stringify({ type: 'auth_error', message: 'User not found' }));
              ws.close();
            }
          } catch (error) {
            ws.send(JSON.stringify({ type: 'auth_error', message: 'Invalid token' }));
            ws.close();
          }
        } else if (message.type === 'join_room') {
          // Join a room
          if (ws.userId) {
            ws.roomId = message.roomId;
            ws.send(JSON.stringify({ type: 'joined_room', roomId: message.roomId }));
          }
        } else if (message.type === 'chat_message') {
          // Handle new chat message
          if (ws.userId && ws.roomId) {
            try {
              const messageData = insertMessageSchema.parse({
                content: message.content,
                userId: ws.userId,
                roomId: ws.roomId
              });

              const savedMessage = await storage.createMessage(messageData);

              // Broadcast to all clients in the same room
              wss.clients.forEach((client: AuthenticatedWebSocket) => {
                if (client.readyState === WebSocket.OPEN && 
                    client.roomId === ws.roomId) {
                  client.send(JSON.stringify({
                    type: 'new_message',
                    message: savedMessage
                  }));
                }
              });
            } catch (error) {
              ws.send(JSON.stringify({ type: 'error', message: 'Failed to send message' }));
            }
          }
        }
      } catch (error) {
        console.error('WebSocket message error:', error);
      }
    });

    ws.on('close', () => {
      console.log('WebSocket connection closed');
    });
  });

  return httpServer;
}
