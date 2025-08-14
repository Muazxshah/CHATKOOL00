# Overview

ChatKOOL is a real-time chat application designed for university students. It provides both university-specific chat rooms and study groups to facilitate academic collaboration and community building. The application features user authentication, real-time messaging via WebSocket connections, and a responsive web interface built with modern React patterns.

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Frontend Architecture
- **React 18** with TypeScript for type safety and modern React patterns
- **Vite** as the build tool for fast development and optimized production builds
- **Wouter** for lightweight client-side routing instead of React Router
- **TanStack Query** for server state management and caching
- **Tailwind CSS** with **shadcn/ui** component library for consistent, accessible UI components
- **React Hook Form** with **Zod** validation for type-safe form handling

## Backend Architecture
- **Express.js** server with TypeScript for API endpoints and middleware
- **WebSocket Server** using the `ws` library for real-time messaging
- **JWT-based authentication** with bcrypt for password hashing
- **In-memory storage** with interface-based design allowing easy database migration
- **Drizzle ORM** configured for PostgreSQL with schema-first approach

## Data Storage Design
- **PostgreSQL** configured via Drizzle ORM with connection to Neon serverless database
- **Schema-driven development** with shared types between frontend and backend
- **Database tables**: users, chat_rooms, messages, room_members
- **Fallback in-memory storage** for development/testing environments

## Authentication & Authorization
- **JWT tokens** with 7-day expiration for session management
- **Password hashing** using bcryptjs
- **Route protection** on both client and server sides
- **WebSocket authentication** via token-based connection upgrade

## Real-time Communication
- **WebSocket connections** for live chat messaging
- **Room-based messaging** with join/leave functionality
- **Message persistence** with user association
- **Connection state management** with automatic reconnection handling

## Development & Build Process
- **ESM modules** throughout the entire stack
- **Shared schema** between client and server for type consistency
- **Hot module replacement** in development via Vite
- **Production optimization** with separate client/server build processes
- **Replit integration** with development banner and error overlay support

## External Dependencies

- **@neondatabase/serverless**: Serverless PostgreSQL database connection
- **Drizzle Kit**: Database migration and schema management tools
- **Radix UI Primitives**: Accessible component foundations for the design system
- **Tailwind CSS**: Utility-first CSS framework for styling
- **WebSocket (ws)**: Real-time bidirectional communication
- **JWT & bcryptjs**: Authentication and security libraries
- **Vite Plugins**: Development tooling including Replit-specific integrations