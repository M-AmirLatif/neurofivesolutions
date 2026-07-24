import crypto from 'node:crypto';
import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { createTaskStore } from './store.js';
import { createAuthStore } from './authStore.js';
import { clearSession, createToken, hashPassword, publicUser, requireAuth, sessionCookie, validateSignup, verifyPassword } from './auth.js';

const priorities = new Set(['low', 'medium', 'high']);
function validateTask(body, existing = {}) {
  const title = typeof body.title === 'string' ? body.title.trim() : '';
  const description = typeof body.description === 'string' ? body.description.trim() : '';
  const priority = body.priority ?? existing.priority ?? 'medium';
  const dueDate = body.dueDate ?? existing.dueDate ?? '';
  const completed = body.completed ?? existing.completed ?? false;
  const errors = {};
  if (!title) errors.title = 'A task title is required.';
  if (title.length > 80) errors.title = 'Keep the title under 80 characters.';
  if (description.length > 280) errors.description = 'Keep the description under 280 characters.';
  if (!priorities.has(priority)) errors.priority = 'Choose low, medium, or high priority.';
  if (dueDate && !/^\d{4}-\d{2}-\d{2}$/.test(dueDate)) errors.dueDate = 'Use a valid date.';
  if (typeof completed !== 'boolean') errors.completed = 'Completed must be true or false.';
  return { errors, value: { title, description, priority, dueDate, completed } };
}

export function createApp({ store = createTaskStore(), authStore = createAuthStore() } = {}) {
  const app = express();
  app.use(cors({ origin: 'http://localhost:5173', credentials: true }));
  app.use(express.json({ limit: '32kb' }));
  app.use(cookieParser());

  app.get('/api/health', (_request, response) => response.json({ status: 'ok' }));
  app.post('/api/auth/signup', async (request, response, next) => {
    try {
      const { errors, value } = validateSignup(request.body);
      if (Object.keys(errors).length) return response.status(400).json({ message: 'Please check the form.', errors });
      const users = await authStore.readUsers();
      if (users.some((user) => user.email === value.email)) return response.status(409).json({ message: 'An account with this email already exists.', errors: { email: 'Email is already registered.' } });
      const user = { id: value.id, name: value.name, email: value.email, passwordHash: await hashPassword(value.password), createdAt: new Date().toISOString() };
      users.push(user); await authStore.writeUsers(users);
      return response.status(201).json({ message: 'Account created. You can now sign in.', user: publicUser(user) });
    } catch (error) { return next(error); }
  });
  app.post('/api/auth/login', async (request, response, next) => {
    try {
      const email = typeof request.body.email === 'string' ? request.body.email.trim().toLowerCase() : '';
      const password = typeof request.body.password === 'string' ? request.body.password : '';
      if (!email || !password) return response.status(400).json({ message: 'Email and password are required.' });
      const users = await authStore.readUsers();
      const user = users.find((item) => item.email === email);
      if (!user || !(await verifyPassword(password, user.passwordHash))) return response.status(401).json({ message: 'Incorrect email or password.' });
      sessionCookie(response, createToken(user));
      return response.json({ message: 'Welcome back.', user: publicUser(user) });
    } catch (error) { return next(error); }
  });
  app.post('/api/auth/logout', (_request, response) => { clearSession(response); response.json({ message: 'Signed out successfully.' }); });
  app.get('/api/auth/me', requireAuth, async (request, response, next) => {
    try { const users = await authStore.readUsers(); const user = users.find((item) => item.id === request.auth.sub); if (!user) return response.status(401).json({ message: 'Account not found.' }); return response.json({ user: publicUser(user) }); }
    catch (error) { return next(error); }
  });

  app.use('/api/tasks', requireAuth);
  app.get('/api/tasks', async (request, response, next) => {
    try { const tasks = await store.readTasks(); response.json(tasks.filter((task) => task.userId === request.auth.sub).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))); }
    catch (error) { next(error); }
  });
  app.post('/api/tasks', async (request, response, next) => {
    try {
      const { errors, value } = validateTask(request.body); if (Object.keys(errors).length) return response.status(400).json({ message: 'Please check the form.', errors });
      const tasks = await store.readTasks(); const timestamp = new Date().toISOString(); const task = { id: crypto.randomUUID(), userId: request.auth.sub, ...value, createdAt: timestamp, updatedAt: timestamp };
      tasks.push(task); await store.writeTasks(tasks); return response.status(201).json(task);
    } catch (error) { return next(error); }
  });
  app.put('/api/tasks/:id', async (request, response, next) => {
    try {
      const tasks = await store.readTasks(); const index = tasks.findIndex((task) => task.id === request.params.id && task.userId === request.auth.sub);
      if (index === -1) return response.status(404).json({ message: 'Task not found.' });
      const { errors, value } = validateTask(request.body, tasks[index]); if (Object.keys(errors).length) return response.status(400).json({ message: 'Please check the form.', errors });
      const updatedTask = { ...tasks[index], ...value, updatedAt: new Date().toISOString() }; tasks[index] = updatedTask; await store.writeTasks(tasks); return response.json(updatedTask);
    } catch (error) { return next(error); }
  });
  app.delete('/api/tasks/:id', async (request, response, next) => {
    try {
      const tasks = await store.readTasks(); const task = tasks.find((item) => item.id === request.params.id && item.userId === request.auth.sub);
      if (!task) return response.status(404).json({ message: 'Task not found.' });
      await store.writeTasks(tasks.filter((item) => item.id !== request.params.id)); return response.json({ message: 'Task deleted.', task });
    } catch (error) { return next(error); }
  });
  app.use((error, _request, response, _next) => { console.error(error); response.status(500).json({ message: 'Something went wrong on the server. Please try again.' }); });
  return app;
}