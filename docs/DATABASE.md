# Database

Database

PostgreSQL

ORM

Prisma

---

# Current Models

## User

Stores application users.

Fields include:

- id
- name
- email
- password
- bio
- avatar
- learningGoal
- preferredStudyTime
- createdAt
- updatedAt

Relationships

One User

↓

Many StudySessions

---

## StudySession

Stores learning sessions.

Fields

- id
- userId
- subject
- topic
- goal
- startedAt
- endedAt
- duration

Relationships

Many Sessions

↓

One User

---

# Planned Models

LearningMemory

Stores AI memory for each learner.

PromptHistory

Stores prompts and refinements.

StudyPlan

Personalized AI study plans.

Quiz

Generated quizzes.

Flashcard

Generated flashcards.

Revision

Revision schedules.

StudyGroup

Learning groups.

GroupMember

Users inside groups.

Friend

Study partner relationships.

Chat

Messages.

Notification

Activity notifications.

AIConversation

Conversation history.

Achievement

Gamification.

LearningAnalytics

Aggregated learning statistics.