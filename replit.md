# Overview

"Learn a Language" is a comprehensive language learning platform built as a full-stack web application. The platform combines interactive learning exercises, AI-powered pronunciation feedback, cultural immersion through stories, and real-time community features to create an engaging multilingual educational experience. The application supports vocabulary building, grammar practice, pronunciation training, and cultural learning through gamified interactions and social learning features.

The platform features a custom logo with a globe icon inside speech bubbles, representing global communication and language learning. The branding emphasizes the universal nature of the platform with the simple, memorable name "Learn a Language".

## Recent Updates (August 2025)
- **Language Limitation**: Restricted platform to support only 6 languages (English, Russian, Mandarin, French, German, Spanish)
- **Feature Removal**: Removed Dashboard, Lessons, Community, and Stories pages and functionality
- **Database Cleanup**: Deleted unused database tables (lessons, cultural_stories, chat_messages, daily_activity, study_sessions, user_languages, language_exchanges)
- **Navigation Simplification**: Removed navigation tabs from header, signin/signup now redirect to 404 page
- **Schema Optimization**: Streamlined database schema to focus on core vocabulary and grammar functionality
- **Animated Background**: Updated animations to only show supported language codes

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Frontend Architecture
- **Framework**: React with TypeScript using Vite as the build tool
- **UI Framework**: shadcn/ui components built on Radix UI primitives
- **Styling**: Tailwind CSS with custom design tokens and CSS variables for theming
- **State Management**: TanStack Query (React Query) for server state management
- **Routing**: Wouter for client-side routing
- **Component Structure**: Modular component architecture with reusable UI components

## Backend Architecture
- **Runtime**: Node.js with TypeScript
- **Framework**: Express.js for REST API endpoints
- **API Structure**: RESTful endpoints for language learning core functionality
- **Database ORM**: Drizzle ORM with type-safe schema definitions
- **Session Management**: Express sessions with PostgreSQL session store

## Data Storage Solutions
- **Primary Database**: PostgreSQL with Neon serverless configuration
- **Database Schema**: Streamlined schema supporting users, languages, vocabulary, grammar exercises, and achievements
- **Migration System**: Drizzle Kit for database migrations and schema management
- **Connection Pooling**: Neon serverless connection pooling for optimal performance

## Authentication and Authorization
- **Session-based Authentication**: Using connect-pg-simple for PostgreSQL session storage
- **User Management**: User profiles with progress tracking and achievement systems
- **Authorization**: Role-based access patterns for different user types and content access levels

## External Dependencies
- **Database**: Neon PostgreSQL serverless database
- **Audio Processing**: Web Speech API for text-to-speech and speech recognition
- **UI Components**: Radix UI primitives for accessible component foundations
- **Development Tools**: Replit-specific plugins for development environment integration
- **Build Tools**: Vite for frontend bundling, esbuild for backend compilation
- **Fonts**: Google Fonts (Inter) for typography
- **Image Hosting**: Unsplash for demo images and placeholder content

## Key Features Architecture
- **Interactive Learning**: Modular exercise components (flashcards, grammar quizzes, pronunciation practice, sentence building)
- **Gamification**: Achievement system, progress tracking, streaks, and point systems
- **Community Features**: Real-time chat, language exchange matching, study groups
- **Cultural Immersion**: Story-based learning with cultural context and traditions
- **Pronunciation Training**: Browser-based speech recognition and text-to-speech feedback
- **Progress Analytics**: Comprehensive tracking of user learning metrics and performance