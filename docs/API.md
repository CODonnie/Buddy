# Buddy API

Base URL

/api/v1

---

# Authentication

POST /auth/register

Create account

POST /auth/login

Authenticate user

GET /auth/me

Get current user

---

# Users

GET /users/me

Current profile

PATCH /users/me

Update profile

PATCH /users/change-password

Change password

---

# Study Sessions

POST /study/start

Start study session

GET /study/current

Current active session

PATCH /study/:id/end

End study session

GET /study/history

Study history

---

# Future Endpoints

AI

POST /ai/chat

POST /ai/refine

POST /ai/quiz

POST /ai/flashcards

POST /ai/revision

Learning

GET /analytics

GET /streak

GET /progress

Collaboration

POST /friends/request

GET /friends

POST /groups

GET /groups

POST /matching/find

Realtime

POST /rooms

GET /rooms

WebSocket /chat

WebSocket /presence

WebSocket /study
