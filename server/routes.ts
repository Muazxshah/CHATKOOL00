import type { Express } from "express";
import { createServer, type Server } from "http";
import { WebSocketServer, WebSocket } from "ws";
import { storage } from "./storage";
import { insertMessageSchema, userEntrySchema } from "@shared/schema";

interface ChatWebSocket extends WebSocket {
  username?: string;
  roomId?: string;
  userId?: string;
}

// Store active WebSocket connections by username
const activeConnections = new Map<string, ChatWebSocket>();

export async function registerRoutes(app: Express): Promise<Server> {
  // Get all chat rooms - no authentication required
  app.get("/api/rooms", async (req, res) => {
    try {
      const rooms = await storage.getAllRooms();
      res.json(rooms);
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Get messages for a room - no authentication required
  app.get("/api/rooms/:roomId/messages", async (req, res) => {
    try {
      const { roomId } = req.params;
      const messages = await storage.getMessagesByRoom(roomId);
      res.json(messages);
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Start random chat - find a match
  app.post("/api/random-chat", async (req, res) => {
    try {
      const { username } = req.body;
      if (!username) {
        return res.status(400).json({ message: "Username required" });
      }

      const matchResult = await storage.findRandomMatch(username);
      if (matchResult) {
        const { matchedUser, room } = matchResult;
        console.log(`Created room for ${username} and ${matchedUser}: ${room.id}`);
        
        // Notify both users via WebSocket if they're connected
        const currentUserWs = activeConnections.get(username);
        const matchedUserWs = activeConnections.get(matchedUser);
        
        if (currentUserWs) {
          currentUserWs.send(JSON.stringify({
            type: 'match_found',
            room,
            matchedUser
          }));
        }
        
        if (matchedUserWs) {
          matchedUserWs.send(JSON.stringify({
            type: 'match_found',
            room,
            matchedUser: username
          }));
        }
        
        res.json({ matched: true, room, matchedUser });
      } else {
        res.json({ matched: false, message: "Waiting for another user..." });
      }
    } catch (error) {
      console.error('Random chat error:', error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  const httpServer = createServer(app);

  // WebSocket server for real-time chat
  const wss = new WebSocketServer({ server: httpServer, path: '/ws' });

  wss.on('connection', (ws: ChatWebSocket, req) => {
    console.log('New WebSocket connection');

    ws.on('message', async (data) => {
      try {
        const message = JSON.parse(data.toString());
        
        if (message.type === 'set_username') {
          // Set username for anonymous chat
          try {
            const userData = userEntrySchema.parse(message);
            ws.username = userData.username;
            
            // Remove any existing connection for this username
            const existingWs = activeConnections.get(userData.username);
            if (existingWs && existingWs !== ws) {
              existingWs.close();
            }
            
            // Store connection for notifications
            activeConnections.set(userData.username, ws);
            
            await storage.addOnlineUser(userData.username);
            console.log(`User ${userData.username} connected via WebSocket`);
            ws.send(JSON.stringify({ type: 'username_set', username: userData.username }));
          } catch (error) {
            ws.send(JSON.stringify({ type: 'error', message: 'Invalid username' }));
          }
        } else if (message.type === 'join_room') {
          // Join a room
          if (ws.username) {
            ws.roomId = message.roomId;
            ws.send(JSON.stringify({ type: 'joined_room', roomId: message.roomId }));
          } else {
            ws.send(JSON.stringify({ type: 'error', message: 'Username required' }));
          }
        } else if (message.type === 'chat_message') {
          // Handle new chat message
          if (ws.username && ws.roomId) {
            try {
              const messageData = insertMessageSchema.parse({
                content: message.content,
                username: ws.username,
                roomId: ws.roomId
              });

              const savedMessage = await storage.createMessage(messageData);

              // Broadcast to all clients in the same room
              wss.clients.forEach((client: ChatWebSocket) => {
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
          } else {
            ws.send(JSON.stringify({ type: 'error', message: 'Username and room required' }));
          }
        } else if (message.type === 'end_chat') {
          // Handle ending a chat - notify the other user
          if (ws.username && ws.roomId) {
            console.log(`User ${ws.username} ended chat in room ${ws.roomId}`);
            
            // Notify all other users in the same room that this user left
            wss.clients.forEach((client: ChatWebSocket) => {
              if (client.readyState === WebSocket.OPEN && 
                  client.roomId === ws.roomId && 
                  client.username !== ws.username) {
                client.send(JSON.stringify({
                  type: 'chat_ended',
                  message: `${ws.username} has left the chat`,
                  leftUser: ws.username
                }));
                // Clear the other user's room so they can start a new chat
                client.roomId = undefined;
              }
            });
            
            // Clear this user's room
            ws.roomId = undefined;
            
            // Confirm chat ended
            ws.send(JSON.stringify({ type: 'chat_ended_confirmed' }));
          }
        }
      } catch (error) {
        console.error('WebSocket message error:', error);
      }
    });

    ws.on('close', async () => {
      console.log('WebSocket connection closed for user:', ws.username);
      if (ws.username) {
        activeConnections.delete(ws.username);
        await storage.removeOnlineUser(ws.username);
      }
    });
  });

  return httpServer;
}
