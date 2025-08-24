# Overview

ChatKOOL is an anonymous online chat platform specifically designed for Filipino college students. It provides instant random 1-on-1 connections without authentication barriers, allowing students to chat with strangers safely and anonymously. The platform features real-time messaging via WebSocket connections, comprehensive SEO optimization targeting keywords like "chatkool", "chatcool", "online chat", "chat online", and "chat with strangers", and a responsive web interface built with modern React patterns.

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
- **In-memory storage** for development with random chat matching system
- **Schema-driven development** with shared types between frontend and backend
- **Random matching algorithm** connecting users instantly for 1-on-1 conversations
- **Temporary chat sessions** without persistent user accounts or registration

## Anonymous Chat System
- **No authentication required** - completely anonymous access
- **Username-only identification** for chat sessions
- **No registration barriers** to prevent user bouncing
- **Instant access** to chat functionality without sign-up

## Real-time Communication
- **WebSocket connections** for live 1-on-1 chat messaging
- **Random matching system** connecting strangers instantly
- **Temporary chat sessions** without message persistence
- **Connection state management** with automatic reconnection handling
- **"New Chat" functionality** to start fresh conversations

## Development & Build Process
- **ESM modules** throughout the entire stack
- **Shared schema** between client and server for type consistency
- **Hot module replacement** in development via Vite
- **Production optimization** with separate client/server build processes
- **Replit integration** with development banner and error overlay support

## External Dependencies

- **Radix UI Primitives**: Accessible component foundations for the design system
- **Tailwind CSS**: Utility-first CSS framework for styling
- **WebSocket (ws)**: Real-time bidirectional communication for anonymous chat
- **Vite Plugins**: Development tooling including Replit-specific integrations

## SEO Optimization (Updated August 2025)

### Target Keywords
- **Primary**: chatkool, chatcool, online chat, chat online, chat with strangers
- **Secondary**: anonymous chat, filipino chat, college students chat, university chat, philippines chat

### Technical SEO Implementation
- **Meta tags**: Comprehensive title, description, keywords, robots directives
- **Open Graph**: Facebook and Twitter card optimizations
- **Structured Data**: Schema.org WebApplication markup for semantic SEO
- **Sitemap**: XML sitemap with all important pages (updated for chatkool.net)
- **Robots.txt**: Proper crawler directives with sitemap reference
- **Canonical URLs**: Proper canonicalization to prevent duplicate content
- **Google Search Console**: Verification file added for search indexing
- **Favicon**: Premium branded favicon with multiple format support

### On-Page SEO Features
- **Keyword-rich content**: Natural integration of target keywords throughout homepage
- **Header tags hierarchy**: Proper H1, H2, H3 structure with keyword targeting
- **Internal linking**: SEO-friendly navigation with keyword-rich anchor text
- **Alt text optimization**: Descriptive alt attributes for images
- **Performance optimization**: Fast loading times and mobile responsiveness

### Content Strategy
- **HomePage focus**: Primary landing page optimized for all target keywords
- **Filipino student targeting**: Content specifically tailored for Philippines market
- **Anonymous chat emphasis**: Strong focus on privacy and no-registration benefits
- **User experience**: Clear value propositions and multiple call-to-action buttons