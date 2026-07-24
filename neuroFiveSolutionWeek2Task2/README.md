# Momentum — Authentication + Protected CRUD

Momentum Week 2 Task 2 extends the Week 2 Task 1 CRUD application with real user accounts and protected, user-specific workspaces.

## Authentication features

- Signup with client-side and server-side validation
- Password rules: 8+ characters, uppercase, lowercase, and number
- Password hashing with bcrypt (12 rounds)
- JWT sessions stored in HTTP-only, SameSite cookies
- Login persistence through `/api/auth/me`
- Protected React dashboard route with automatic login redirect
- Protected task API endpoints and user-owned task records
- Logout clears the secure session and immediately blocks protected access
- Duplicate-email and invalid-credential handling

## Full stack

- Frontend: React 19, React Router, Vite, CSS, Lucide React
- Backend: Node.js, Express, bcryptjs, JWT, cookie-parser
- Persistence: durable JSON stores for users and tasks
- Testing: Node test runner and Supertest

## Run locally

```bash
npm install
npm start
```

Open only `http://localhost:5173`.

## Demo flow

1. Open `/signup` and test validation.
2. Create an account with a secure password.
3. Sign in with the new credentials.
4. Confirm the protected dashboard opens.
5. Create or update a private task.
6. Sign out from the sidebar.
7. Try `/dashboard` and confirm it redirects to `/login`.

## Automated verification

```bash
npm test
npm run build
```

Tests cover anonymous blocking, signup validation, password safety, login, secure cookies, protected CRUD, logout, and blocked access after logout.

## Environment

Copy `.env.example` to `.env` and replace `JWT_SECRET` with a long random value before deployment.