# Quran API

A comprehensive REST API for Quran reading applications with features including user authentication, bookmarks, notes, reading history, reading plans, achievements, and more.

## 📋 Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Environment Variables](#environment-variables)
- [Database Setup](#database-setup)
- [Running the Application](#running-the-application)
- [API Documentation](#api-documentation)
  - [Authentication](#authentication)
  - [Chapters](#chapters)
  - [Verses](#verses)
  - [Profile](#profile)
  - [Notes](#notes)
  - [Bookmarks](#bookmarks)
  - [Reading History](#reading-history)
  - [Reading Plans](#reading-plans)
  - [Dashboard](#dashboard)
  - [Achievements](#achievements)
- [Project Structure](#project-structure)

## ✨ Features

- **User Authentication**: Email/password authentication with email verification using Better Auth
- **Chapter Management**: Retrieve Quran chapters (Surahs) information
- **Verse Management**: Get verses by page number
- **Personal Notes**: Create, update, and manage notes on specific verses
- **Bookmarks**: Save and manage bookmarks for quick access to pages
- **Reading History**: Track reading progress with automatic history logging
- **Reading Plans**: Create customizable reading plans (daily, weekly, monthly, custom)
- **Achievements**: Unlock achievements based on reading milestones
- **Dashboard**: Get comprehensive user statistics and progress
- **Rate Limiting**: API rate limiting for security
- **Email Notifications**: Automated email verification and notifications

## 🛠 Tech Stack

- **Runtime**: Node.js with TypeScript
- **Framework**: Express.js
- **Database**: PostgreSQL
- **ORM**: Prisma
- **Authentication**: Better Auth
- **Validation**: Zod
- **Email**: Nodemailer
- **Caching**: Cache Manager
- **Rate Limiting**: Express Rate Limit
- **CORS**: Enabled for cross-origin requests

## 📦 Prerequisites

- Node.js (v18 or higher)
- PostgreSQL database
- npm or yarn package manager

## 🚀 Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd quran-api
```

2. Install dependencies:
```bash
npm install
```

## 🔐 Environment Variables

Copy the example environment file and adjust the values:

```bash
cp .env.example .env
```

Then edit `.env` with your configuration.

## 💾 Database Setup

1. Run Prisma migrations:
```bash
npx prisma migrate dev
```

2. Generate Prisma Client:
```bash
npx prisma generate
```

3. (Optional) Seed achievements data:
```bash
npx ts-node src/scripts/seed-achievements.ts
```

## 🏃 Running the Application

### Development Mode
```bash
npm run dev
```

### Production Mode
```bash
npm run build
npm start
```

The API will be available at `http://localhost:3001`

## 📚 API Documentation

Base URL: `http://localhost:3001/api`

### Authentication

Authentication is handled by Better Auth. All endpoints (except auth endpoints) require authentication.

**Auth Base URL**: `http://localhost:3001/api/auth/*`

Better Auth provides the following endpoints automatically:
- `POST /api/auth/sign-up/email` - Register with email and password
- `POST /api/auth/sign-in/email` - Sign in with email and password
- `POST /api/auth/sign-out` - Sign out
- `GET /api/auth/verify-email` - Verify email address

**Headers Required for Protected Routes:**
```
Cookie: better-auth.session_token=<session-token>
```

---

### Chapters

#### Get All Chapters
```http
GET /api/chapters
```

**Description**: Retrieve a list of all Quran chapters (Surahs).

**Authentication**: Required

**Response**:
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "name": "Al-Fatihah",
      "englishName": "The Opening",
      "numberOfAyahs": 7,
      "revelationType": "Meccan"
    }
  ]
}
```

#### Get Chapter by ID
```http
GET /api/chapters/:id
```

**Description**: Retrieve detailed information about a specific chapter.

**Authentication**: Required

**Parameters**:
- `id` (path parameter): Chapter ID (1-114)

**Response**:
```json
{
  "success": true,
  "data": {
    "id": 1,
    "name": "Al-Fatihah",
    "englishName": "The Opening",
    "numberOfAyahs": 7,
    "revelationType": "Meccan",
    "verses": [...]
  }
}
```

---

### Verses

#### Get Verses by Page Number
```http
GET /api/verses/page/:pageNumber
```

**Description**: Retrieve all verses on a specific page of the Quran.

**Authentication**: Required

**Parameters**:
- `pageNumber` (path parameter): Page number (1-604)

**Response**:
```json
{
  "success": true,
  "data": {
    "page": 1,
    "verses": [
      {
        "number": 1,
        "text": "بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ",
        "surah": "Al-Fatihah",
        "numberInSurah": 1
      }
    ]
  }
}
```

---

### Profile

#### Get User Profile
```http
GET /api/profile
```

**Description**: Retrieve the authenticated user's profile information.

**Authentication**: Required

**Response**:
```json
{
  "success": true,
  "data": {
    "id": "user-id",
    "name": "John Doe",
    "email": "john@example.com",
    "emailVerified": true,
    "image": "https://example.com/avatar.jpg",
    "createdAt": "2024-01-01T00:00:00.000Z"
  }
}
```

#### Update Profile
```http
PUT /api/profile
```

**Description**: Update user profile information.

**Authentication**: Required

**Request Body**:
```json
{
  "name": "John Doe",
  "image": "https://example.com/new-avatar.jpg"
}
```

**Validation**:
- `name`: String (2-100 characters, required)
- `image`: String (optional)

**Response**:
```json
{
  "success": true,
  "message": "Profile updated successfully",
  "data": {
    "id": "user-id",
    "name": "John Doe",
    "email": "john@example.com",
    "image": "https://example.com/new-avatar.jpg"
  }
}
```

#### Update Email
```http
PUT /api/profile/email
```

**Description**: Request to change user email address (requires verification).

**Authentication**: Required

**Request Body**:
```json
{
  "newEmail": "newemail@example.com"
}
```

**Validation**:
- `newEmail`: Valid email address (required)

**Response**:
```json
{
  "success": true,
  "message": "Verification email sent to new email address"
}
```

#### Resend Verification Email
```http
POST /api/profile/resend-verification
```

**Description**: Resend email verification link.

**Authentication**: Not required

**Request Body**:
```json
{
  "email": "user@example.com"
}
```

**Response**:
```json
{
  "success": true,
  "message": "Verification email sent"
}
```

---

### Notes

#### Create Note
```http
POST /api/notes
```

**Description**: Create a new note for a specific verse.

**Authentication**: Required

**Request Body**:
```json
{
  "pageId": 1,
  "ayahId": 1,
  "content": "This is my note about this verse",
  "surahName": "Al-Fatihah",
  "ayahNumber": 1,
  "color": "yellow"
}
```

**Validation**:
- `pageId`: Number (min: 1, required)
- `ayahId`: Number (min: 1, required)
- `content`: String (1-500 characters, required)
- `surahName`: String (1-100 characters, required)
- `ayahNumber`: Number (min: 1, required)
- `color`: String (3-20 characters, optional, default: "yellow")

**Response**:
```json
{
  "success": true,
  "message": "Note created successfully",
  "data": {
    "id": "note-id",
    "userId": "user-id",
    "pageId": 1,
    "ayahId": 1,
    "content": "This is my note about this verse",
    "surahName": "Al-Fatihah",
    "ayahNumber": 1,
    "color": "yellow",
    "createdAt": "2024-01-01T00:00:00.000Z"
  }
}
```

#### Update Note
```http
PUT /api/notes/:noteId
```

**Description**: Update an existing note.

**Authentication**: Required

**Parameters**:
- `noteId` (path parameter): Note ID

**Request Body**:
```json
{
  "content": "Updated note content",
  "color": "blue"
}
```

**Validation**:
- `content`: String (1-500 characters, optional)
- `color`: String (3-20 characters, optional)

**Response**:
```json
{
  "success": true,
  "message": "Note updated successfully",
  "data": {
    "id": "note-id",
    "content": "Updated note content",
    "color": "blue",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
}
```

#### Get My Notes
```http
GET /api/notes
```

**Description**: Retrieve all notes created by the authenticated user.

**Authentication**: Required

**Response**:
```json
{
  "success": true,
  "data": [
    {
      "id": "note-id",
      "pageId": 1,
      "ayahId": 1,
      "content": "My note",
      "surahName": "Al-Fatihah",
      "ayahNumber": 1,
      "color": "yellow",
      "createdAt": "2024-01-01T00:00:00.000Z"
    }
  ]
}
```

#### Get Notes by Page
```http
GET /api/notes/page/:pageId
```

**Description**: Retrieve all notes for a specific page.

**Authentication**: Required

**Parameters**:
- `pageId` (path parameter): Page ID

**Response**:
```json
{
  "success": true,
  "data": [
    {
      "id": "note-id",
      "ayahId": 1,
      "content": "My note",
      "ayahNumber": 1,
      "color": "yellow"
    }
  ]
}
```

---

### Bookmarks

#### Create Bookmark
```http
POST /api/bookmarks
```

**Description**: Create a bookmark for a specific page.

**Authentication**: Required

**Request Body**:
```json
{
  "title": "My Reading Position",
  "surahName": "Al-Baqarah",
  "pageId": 10
}
```

**Validation**:
- `title`: String (1-100 characters, required)
- `surahName`: String (1-100 characters, required)
- `pageId`: Number (min: 1, required)

**Note**: Only one bookmark per page per user is allowed.

**Response**:
```json
{
  "success": true,
  "message": "Bookmark created successfully",
  "data": {
    "id": "bookmark-id",
    "userId": "user-id",
    "title": "My Reading Position",
    "surahName": "Al-Baqarah",
    "pageId": 10,
    "createdAt": "2024-01-01T00:00:00.000Z"
  }
}
```

#### Get My Bookmarks
```http
GET /api/bookmarks
```

**Description**: Retrieve all bookmarks created by the authenticated user.

**Authentication**: Required

**Response**:
```json
{
  "success": true,
  "data": [
    {
      "id": "bookmark-id",
      "title": "My Reading Position",
      "surahName": "Al-Baqarah",
      "pageId": 10,
      "createdAt": "2024-01-01T00:00:00.000Z"
    }
  ]
}
```

#### Get Bookmark by Page
```http
GET /api/bookmarks/page/:pageId
```

**Description**: Check if a bookmark exists for a specific page.

**Authentication**: Required

**Parameters**:
- `pageId` (path parameter): Page ID

**Response**:
```json
{
  "success": true,
  "data": {
    "id": "bookmark-id",
    "title": "My Reading Position",
    "surahName": "Al-Baqarah",
    "pageId": 10
  }
}
```

#### Delete Bookmark
```http
DELETE /api/bookmarks/:bookmarkId
```

**Description**: Delete a bookmark.

**Authentication**: Required

**Parameters**:
- `bookmarkId` (path parameter): Bookmark ID

**Response**:
```json
{
  "success": true,
  "message": "Bookmark deleted successfully"
}
```

---

### Reading History

#### Create Reading History
```http
POST /api/history
```

**Description**: Log a reading session (tracks which page/verse was read).

**Authentication**: Required

**Request Body**:
```json
{
  "pageId": 1,
  "surahId": 1,
  "ayahNumber": 1,
  "surahName": "Al-Fatihah",
  "juzNumber": 1
}
```

**Validation**:
- `pageId`: Number (min: 1, required)
- `surahId`: Number (min: 1, required)
- `ayahNumber`: Number (min: 1, required)
- `surahName`: String (1-100 characters, required)
- `juzNumber`: Number (min: 1, required)

**Response**:
```json
{
  "success": true,
  "message": "Reading history saved",
  "data": {
    "id": "history-id",
    "userId": "user-id",
    "pageId": 1,
    "surahId": 1,
    "surahName": "Al-Fatihah",
    "juzNumber": 1,
    "ayahNumber": 1,
    "createdAt": "2024-01-01T00:00:00.000Z"
  }
}
```

---

### Reading Plans

#### Create Reading Plan
```http
POST /api/reading-plans
```

**Description**: Create a personalized reading plan.

**Authentication**: Required

**Request Body**:
```json
{
  "title": "Daily Reading",
  "icon": "📖",
  "filter": "PAGE",
  "frequency": "DAILY",
  "amount": 5,
  "customDay": null,
  "chapterId": null,
  "chapterName": null,
  "chapterPages": null
}
```

**Validation**:
- `title`: String (1-100 characters, required)
- `icon`: String (1-100 characters, required)
- `filter`: Enum ["AYAH", "PAGE", "JUZ", "SURAH"] (required)
- `frequency`: Enum ["DAILY", "WEEKLY", "MONTHLY", "CUSTOM_DAY"] (required)
- `amount`: Number (min: 1, optional)
- `customDay`: Number (0-6, optional) - Day of week (0=Sunday, 6=Saturday)
- `chapterId`: Number (min: 1, optional)
- `chapterName`: String (1-100 characters, optional)
- `chapterPages`: String (optional)

**Response**:
```json
{
  "success": true,
  "message": "Reading plan created successfully",
  "data": {
    "id": "plan-id",
    "userId": "user-id",
    "title": "Daily Reading",
    "icon": "📖",
    "filter": "PAGE",
    "frequency": "DAILY",
    "amount": 5,
    "createdAt": "2024-01-01T00:00:00.000Z"
  }
}
```

#### Update Reading Plan
```http
PUT /api/reading-plans/:readingPlanId
```

**Description**: Update an existing reading plan.

**Authentication**: Required

**Parameters**:
- `readingPlanId` (path parameter): Reading plan ID

**Request Body**: Same as Create Reading Plan

**Response**:
```json
{
  "success": true,
  "message": "Reading plan updated successfully",
  "data": {
    "id": "plan-id",
    "title": "Updated Daily Reading",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
}
```

#### Delete Reading Plan
```http
DELETE /api/reading-plans/:readingPlanId
```

**Description**: Delete a reading plan.

**Authentication**: Required

**Parameters**:
- `readingPlanId` (path parameter): Reading plan ID

**Response**:
```json
{
  "success": true,
  "message": "Reading plan deleted successfully"
}
```

#### Get My Reading Plans
```http
GET /api/reading-plans
```

**Description**: Retrieve all reading plans created by the authenticated user.

**Authentication**: Required

**Response**:
```json
{
  "success": true,
  "data": [
    {
      "id": "plan-id",
      "title": "Daily Reading",
      "icon": "📖",
      "filter": "PAGE",
      "frequency": "DAILY",
      "amount": 5,
      "createdAt": "2024-01-01T00:00:00.000Z"
    }
  ]
}
```

---

### Dashboard

#### Get Dashboard Data
```http
GET /api/dashboards
```

**Description**: Retrieve comprehensive user statistics including reading history, achievements, streaks, and more.

**Authentication**: Required

**Response**:
```json
{
  "success": true,
  "data": {
    "totalPagesRead": 150,
    "totalAyahsRead": 2500,
    "currentStreak": 7,
    "longestStreak": 30,
    "totalReadingDays": 45,
    "recentHistory": [...],
    "achievements": [...],
    "readingPlans": [...]
  }
}
```

---

### Achievements

#### Get Achievements
```http
GET /api/achievements
```

**Description**: Retrieve all available achievements and user's unlocked achievements.

**Authentication**: Required

**Response**:
```json
{
  "success": true,
  "data": [
    {
      "id": "achievement-id",
      "name": "First Page",
      "slug": "first-page",
      "description": "Read your first page of the Quran",
      "icon": "🎯",
      "unlocked": true,
      "unlockedAt": "2024-01-01T00:00:00.000Z"
    }
  ]
}
```

---

## 📁 Project Structure

```
quran-api/
├── prisma/
│   ├── schema.prisma          # Prisma database schema
│   └── migrations/            # Database migrations
├── src/
│   ├── controllers/           # Request handlers
│   │   ├── achievement.controller.ts
│   │   ├── bookmark.controller.ts
│   │   ├── chapter.controller.ts
│   │   ├── dashboard.controller.ts
│   │   ├── history.controller.ts
│   │   ├── note.controller.ts
│   │   ├── profile.controller.ts
│   │   ├── reading-plan.controller.ts
│   │   └── verse.controller.ts
│   ├── dtos/                  # Data transfer objects (Zod schemas)
│   │   ├── bookmark/
│   │   ├── history/
│   │   ├── note/
│   │   ├── profile/
│   │   └── reading-plan/
│   ├── emails/                # Email templates
│   ├── generated/             # Generated Prisma client
│   ├── helpers/               # Utility functions
│   │   └── errors/            # Custom error classes
│   ├── interfaces/            # TypeScript interfaces
│   ├── lib/                   # External service configurations
│   │   ├── auth.ts            # Better Auth configuration
│   │   ├── cache-manager.ts  # Cache configuration
│   │   ├── nodemailer.ts     # Email service
│   │   └── prisma.ts          # Prisma client
│   ├── middlewares/           # Express middlewares
│   │   ├── auth.middleware.ts
│   │   ├── rate-limit.middleware.ts
│   │   └── validate.middleware.ts
│   ├── routers/               # API routes
│   │   └── index.ts           # Main router
│   ├── scripts/               # Utility scripts
│   │   └── seed-achievements.ts
│   ├── services/              # Business logic
│   ├── app.ts                 # Express app configuration
│   └── server.ts              # Server entry point
├── .env                       # Environment variables
├── .gitignore
├── package.json
├── tsconfig.json
└── README.md
```

## 🔒 Security Features

- **Rate Limiting**: Prevents abuse by limiting request frequency
- **Authentication**: Secure session-based authentication with Better Auth
- **Email Verification**: Required before account activation
- **Input Validation**: All inputs validated using Zod schemas
- **CORS**: Configured for specific origins
- **SQL Injection Prevention**: Prisma ORM provides parameterized queries

## 📝 API Response Format

All API responses follow a consistent format:

**Success Response**:
```json
{
  "success": true,
  "data": {},
  "message": "Optional success message"
}
```

**Error Response**:
```json
{
  "success": false,
  "error": "Error message",
  "statusCode": 400
}
```

## 🚦 Rate Limiting

All endpoints are rate-limited to prevent abuse. Default limits apply unless specified otherwise.

## 🙏 Acknowledgments

- Quran data provided by [Quran Foundation](https://quran.foundation/)
- Built with Better Auth for authentication
- Uses Prisma for database management

---

For more information or support, please open an issue on the repository.
