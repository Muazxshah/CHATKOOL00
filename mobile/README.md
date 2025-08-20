# ChatKOOL Mobile App

Anonymous chat platform for Filipino college students - React Native mobile application.

## Features

🔥 **Core Features:**
- **Anonymous Instant Chat** - Connect with random Filipino students
- **No Registration** - Jump straight into conversations
- **AI Fallback** - Smart AI students when humans unavailable
- **Real-time Messaging** - WebSocket-powered instant communication
- **Filipino Student Focus** - Tailored for Philippines college community

📱 **Mobile-Optimized:**
- **Native iOS & Android** - True mobile app experience
- **Push Notifications** - Never miss a message
- **Offline Support** - Works even with poor connection
- **Touch-Optimized UI** - Designed for mobile-first experience

## Getting Started

### Prerequisites
- Node.js 16+
- Expo CLI
- iOS Simulator / Android Emulator

### Installation

1. **Install dependencies:**
   ```bash
   cd mobile
   npm install
   ```

2. **Start development server:**
   ```bash
   npm start
   ```

3. **Run on device:**
   ```bash
   # iOS
   npm run ios
   
   # Android
   npm run android
   ```

## Project Structure

```
mobile/
├── src/
│   ├── screens/         # App screens
│   │   ├── HomeScreen.tsx
│   │   └── ChatScreen.tsx
│   ├── components/      # Reusable components
│   ├── hooks/          # Custom hooks
│   │   └── useWebSocket.ts
│   ├── services/       # API services
│   │   └── ChatService.ts
│   ├── types/          # TypeScript types
│   └── navigation/     # Navigation setup
├── assets/             # Images, icons, fonts
├── App.tsx            # Main app component
└── app.json           # Expo configuration
```

## Backend Integration

The mobile app connects to the same backend API as the web version:

- **WebSocket**: Real-time messaging
- **REST API**: User matching and AI chat
- **Seamless Experience**: Same features as web version

## Deployment

### App Store & Google Play

1. **Build for production:**
   ```bash
   expo build:ios
   expo build:android
   ```

2. **Submit to stores:**
   - iOS: Upload to App Store Connect
   - Android: Upload to Google Play Console

### Over-the-Air Updates

Use Expo's OTA updates for instant app improvements:
```bash
expo publish
```

## Technical Details

- **Framework**: React Native with Expo
- **Navigation**: React Navigation 6
- **State Management**: React hooks + Context
- **WebSocket**: Native WebSocket API
- **UI**: Custom components with React Native styling
- **TypeScript**: Full type safety
- **Platform**: iOS 13+ / Android 8+

## SEO & Discovery

Mobile app optimized for App Store SEO:
- **Keywords**: "chat", "anonymous", "students", "philippines", "college"
- **Description**: Targeted for Filipino student community
- **Screenshots**: Showcase key features and Filipino branding
- **Reviews**: Encourage positive student feedback

## Future Enhancements

🚀 **Planned Features:**
- Push notifications for messages
- Dark mode support
- Voice messages
- Group chat rooms
- Student verification system
- Campus-specific matching

---

**Built for Filipino students, by Filipino developers** 🇵🇭