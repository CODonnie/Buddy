# Buddy AI Development Guide

## Project

Buddy is a collaborative study platform built as a professional production-grade application.

Tech Stack

- Node.js
- Express
- TypeScript
- PostgreSQL
- Prisma
- React
- React Native (Expo)
- Docker

---

## Architecture

Route
→ Controller
→ Service
→ Repository
→ Prisma

Never skip layers.

---

## Validation

Use Zod.

Never validate inside controllers.

Always use validate middleware.

---

## Error Handling

Use AppError.

Never throw new Error().

---

## Responses

Always use sendResponse().

---

## Authentication

JWT access token.

Protected routes use authMiddleware.

---

## Logging

Use logger.

Never use console.log().

---

## Folder Convention

Every module contains:

controller
service
repository
routes
schema
types

---

## Coding Style

Use async/await.

Prefer early returns.

No business logic inside controllers.

No Prisma queries outside repositories.

Services contain business logic only.

Repositories contain database logic only.

Controllers contain HTTP logic only.

---

## General Rule

Whenever adding a feature, follow the existing architecture.

Never introduce a new pattern unless it improves the whole project.