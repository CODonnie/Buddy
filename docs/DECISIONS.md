# Architectural Decisions

## ADR-001

Authentication uses JWT access tokens.

Current transport:

Authorization: Bearer <token>

Reason:

Simple MVP implementation.

Future:

Refresh Tokens

HttpOnly Cookies (Web)

Secure Token Rotation

---

## ADR-002

Controllers remain thin.

Business logic belongs inside services.

Reason:

Maintainability.

---

## ADR-003

Repositories are the only layer allowed to access Prisma.

Reason:

Database abstraction.

---

## ADR-004

Every request is validated using Zod.

Reason:

Runtime validation.

---

## ADR-005

Application errors use AppError.

Reason:

Consistent error handling.

---

## ADR-006

HTTP status codes come from HTTP_STATUS constants.

Reason:

Avoid magic numbers.

---

## ADR-007

sendResponse() is the standard response formatter.

Reason:

Consistent API responses.

---

## ADR-008

Buddy follows feature-first architecture.

Reason:

Better scalability.

---

## ADR-009

React Query manages server state.

Reason:

Caching

Synchronization

Automatic refetching

---

## ADR-010

Zustand manages client state.

Reason:

Simple

Fast

Minimal boilerplate

---

## ADR-011

Buddy prioritizes active learning over answer generation.

Reason:

The product's primary value is improving learning outcomes, not simply providing answers.