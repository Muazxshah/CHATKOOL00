import { sql } from "drizzle-orm";
import { pgTable, text, varchar, timestamp, boolean, integer } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  email: text("email").notNull().unique(),
  password: text("password").notNull(),
  fullName: text("full_name").notNull(),
  university: text("university").notNull(),
  isVerified: boolean("is_verified").default(false),
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
  userId: varchar("user_id").references(() => users.id).notNull(),
  roomId: varchar("room_id").references(() => chatRooms.id).notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const roomMembers = pgTable("room_members", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").references(() => users.id).notNull(),
  roomId: varchar("room_id").references(() => chatRooms.id).notNull(),
  joinedAt: timestamp("joined_at").defaultNow(),
});

export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  createdAt: true,
  isVerified: true,
}).extend({
  confirmPassword: z.string().min(1, "Please confirm your password"),
  ageConfirmation: z.boolean().refine(val => val === true, "You must be 18 or older to join ChatKOOL"),
  termsAccepted: z.boolean().refine(val => val === true, "You must accept the terms and conditions"),
}).refine(data => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

export const insertMessageSchema = createInsertSchema(messages).omit({
  id: true,
  createdAt: true,
});

export const insertRoomSchema = createInsertSchema(chatRooms).omit({
  id: true,
  createdAt: true,
  memberCount: true,
});

export const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(1, "Please enter your password"),
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type InsertMessage = z.infer<typeof insertMessageSchema>;
export type Message = typeof messages.$inferSelect;
export type InsertRoom = z.infer<typeof insertRoomSchema>;
export type ChatRoom = typeof chatRooms.$inferSelect;
export type RoomMember = typeof roomMembers.$inferSelect;
export type LoginData = z.infer<typeof loginSchema>;

// Extended types with relations
export type MessageWithUser = Message & {
  user: Pick<User, 'id' | 'username' | 'fullName'>;
};

export type RoomWithMembers = ChatRoom & {
  members: RoomMember[];
};
