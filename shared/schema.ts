import { sql } from "drizzle-orm";
import { pgTable, text, varchar, timestamp, boolean, integer } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull(),
  fullName: text("full_name").notNull(),
  university: text("university"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const chatRooms = pgTable("chat_rooms", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  description: text("description"),
  type: text("type").notNull(), // 'university', 'study_group', 'general'
  university: text("university"), // null for non-university rooms
  memberCount: integer("member_count").default(0),
  createdAt: timestamp("created_at").defaultNow(),
});

export const messages = pgTable("messages", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  content: text("content").notNull(),
  username: text("username").notNull(),
  roomId: varchar("room_id").references(() => chatRooms.id).notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

// Room members table - simplified for anonymous access
export const roomMembers = pgTable("room_members", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull(),
  roomId: varchar("room_id").references(() => chatRooms.id).notNull(),
  joinedAt: timestamp("joined_at").defaultNow(),
});

// Simple message schema for anonymous chat
export const insertMessageSchema = createInsertSchema(messages).omit({
  id: true,
  createdAt: true,
});

export const insertRoomSchema = createInsertSchema(chatRooms).omit({
  id: true,
  createdAt: true,
  memberCount: true,
});

// Simple user entry schema - just username for anonymous chat
export const userEntrySchema = z.object({
  username: z.string().min(1, "Please enter a username").max(20, "Username too long"),
  university: z.string().optional(),
});

export type UserEntry = z.infer<typeof userEntrySchema>;
export type User = typeof users.$inferSelect;
export type InsertMessage = z.infer<typeof insertMessageSchema>;
export type Message = typeof messages.$inferSelect;
export type InsertRoom = z.infer<typeof insertRoomSchema>;
export type ChatRoom = typeof chatRooms.$inferSelect;
export type RoomMember = typeof roomMembers.$inferSelect;

// Extended types for anonymous chat
export type MessageWithUser = Message & {
  user: {
    username: string;
  };
};

export type RoomWithMembers = ChatRoom & {
  members: RoomMember[];
};
