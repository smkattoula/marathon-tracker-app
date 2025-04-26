# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Build Commands

### Frontend
- `npm start` - Start Expo development server
- `npm run ios/android/web` - Start on specific platform with DARK_MODE=media
- `npm test` - Run Jest tests in watch mode
- `npm run lint` - Run Expo linting 

### Backend
- `cd backend && npm run dev` - Run backend server with nodemon

## Code Style Guidelines

- **TypeScript**: Strict type checking enabled, use interfaces for props/state
- **Imports**: Use aliases (`@/*` points to root directory)
- **Components**: Functional components with hooks, PascalCase naming
- **Styling**: NativeWind/Tailwind for styling
- **Error Handling**: Use try/catch for async operations, appropriate state management
- **Authentication**: JWT and Google OAuth via AuthService
- **UI Framework**: GlueStack UI components with NativeWind customization

## Project Structure
- `/app`: Expo Router screens
- `/components`: React components
- `/services`: Service modules like AuthService
- `/backend`: Express server with MVC architecture
  - `/src/controllers`: Request handlers
  - `/src/models`: Mongoose models
  - `/src/routes`: API endpoints
  - `/src/services`: Business logic