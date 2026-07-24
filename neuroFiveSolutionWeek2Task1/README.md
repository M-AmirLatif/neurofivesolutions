# Momentum — Full-Stack CRUD Task Manager

Momentum is a complete CRUD application built for NeuroFive Solutions Internship Week 2, Task 1. The React frontend communicates with an Express API that stores tasks in a durable JSON file.

## Features

- Create tasks with a title, description, priority, and due date
- Read all tasks from the custom backend API
- Update task details and toggle completion
- Delete tasks with a confirmation step
- Visible loading and error feedback for every operation
- Form validation on both the client and server
- Filtering, live progress statistics, and responsive layouts
- Persistent JSON-file storage with atomic writes

## Tech stack

- Frontend: React 19, Vite, CSS Modules, Lucide React
- Backend: Node.js, Express, CORS
- Testing: Node test runner and Supertest

## Run locally

Node.js 18 or newer is required.

```bash
npm install
npm start
```

Open `http://localhost:5173`. The API runs on `http://localhost:5000`.

## Production build

```bash
npm run build
npm run start:production
```

The Express server serves the built React application and API from one process at `http://localhost:5000`.

## API endpoints

| Method | Endpoint | Action |
| --- | --- | --- |
| GET | `/api/tasks` | List all tasks |
| POST | `/api/tasks` | Create a task |
| PUT | `/api/tasks/:id` | Update a task |
| DELETE | `/api/tasks/:id` | Delete a task |

## Test

```bash
npm test
```
