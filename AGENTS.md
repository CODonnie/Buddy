# Buddy Engineering Guide

## Project

Buddy is an AI-powered collaborative learning platform.

The project follows industry-standard architecture.

The priority is maintainability over speed.

Always prefer clean architecture over shortcuts.

---

# Tech Stack

Backend
- Express
- TypeScript
- Prisma
- PostgreSQL
- Docker

Frontend
- React
- Vite
- React Query
- Zustand

Mobile
- React Native
- Expo
- React Query
- Zustand

---

# Folder Structure

Backend modules live under

src/modules

Each feature contains

- controller
- service
- repository
- routes
- schema
- types (optional)

Never mix business logic into controllers.

Controllers call Services.

Services call Repositories.

Repositories call Prisma.

---

# Backend Style Guide

Controllers

- Use asyncHandler
- Use sendResponse()
- Never return Prisma objects directly
- Keep controllers thin

Services

- Business logic lives here.
- Throw AppError.
- Never use res or req.

Repositories

Only database access.

No business logic.

---

# Validation

Always validate requests using Zod.

Never validate manually inside controllers.

---

# Authentication

Protected routes use authMiddleware.

Authenticated user is available through

req.user.userId

Never decode JWT manually.

---

# Responses

Always use

sendResponse()

Never call

res.json()

except middleware.

---

# Errors

Always throw

AppError

Use

HTTP_STATUS

Never use magic numbers.

Correct

throw new AppError(
    HTTP_STATUS.NOT_FOUND,
    "User not found"
)

Wrong

throw new Error("User not found")

---

# Prisma

Repositories are the only place Prisma is used.

Never use Prisma directly inside controllers.

---

# Naming

camelCase variables

PascalCase classes

Feature folders singular

auth
study
users

---

# Architecture

Controller

↓

Service

↓

Repository

↓

Prisma

Never skip layers.

---

# Code Quality

Prefer readability.

Avoid duplication.

Extract reusable utilities.

Do not over-engineer.

When unsure, ask before making architectural decisions.
