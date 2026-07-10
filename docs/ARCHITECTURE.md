# Buddy Architecture

## Overview

Buddy is an AI-powered collaborative learning platform built as a monorepo.

The project follows a modular, feature-first architecture with clear separation of responsibilities.

The primary goal is maintainability, scalability, and clean architecture.

---

# Tech Stack

## Backend

- Node.js
- Express
- TypeScript
- Prisma ORM
- PostgreSQL
- Docker
- Zod
- JWT Authentication

## Mobile

- React Native
- Expo
- React Navigation
- React Query
- Zustand
- Async Storage

## Web

- React
- Vite
- React Query
- Zustand

---

# Monorepo Structure

```
apps/
    api/
    mobile/
    web/

packages/
    types/
```

Future shared packages may include:

- ui
- config
- eslint-config
- tsconfig
- ai-sdk

---

# Backend Architecture

```
Routes

↓

Controllers

↓

Services

↓

Repositories

↓

Prisma

↓

PostgreSQL
```

## Controllers

Responsibilities:

- Receive requests
- Call services
- Return responses using sendResponse()

Controllers must never contain business logic.

---

## Services

Responsibilities:

- Business logic
- Validation beyond schema validation
- Authorization
- Domain rules
- Throw AppError when necessary

Services never access Express objects.

---

## Repositories

Responsibilities:

- Database access only
- Prisma queries
- No business logic

Repositories are the only layer allowed to communicate with Prisma.

---

## Shared Layer

Contains reusable application utilities.

Current folders:

constants/

errors/

middleware/

utils/

---

# API Standards

All successful responses use:

sendResponse()

All errors throw:

AppError

Validation uses:

Zod

Protected routes use:

authMiddleware

---

# Authentication

JWT Authentication

Current implementation:

Access Token

↓

Authorization Header

↓

Bearer Token

Refresh tokens and HttpOnly cookies will be introduced in a later sprint.

---

# Database

PostgreSQL

Prisma ORM

UUID primary keys

Soft deletes are not implemented yet.

---

# Mobile Architecture

```
features/

    auth/

        api/

        screens/

        store/

        types/
```

Each feature owns its own:

- Screens
- API calls
- Types
- Store

Shared UI components belong inside:

components/

---

# State Management

Server State

React Query

Client State

Zustand

Persistent Authentication

Async Storage

---

# Design Philosophy

Buddy follows:

- Feature-first architecture
- Clean architecture
- Thin controllers
- Fat services
- Repository pattern
- Explicit error handling
- Reusable utilities
- Strong TypeScript typing
- Incremental development