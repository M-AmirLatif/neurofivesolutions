import crypto from 'node:crypto';
import express from 'express';
import cors from 'cors';
import { createTaskStore } from './store.js';

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

  return {
    errors,
    value: { title, description, priority, dueDate, completed }
  };
}

export function createApp({ store = createTaskStore() } = {}) {
  const app = express();
  app.use(cors());
  app.use(express.json({ limit: '32kb' }));

  app.get('/api/health', (_request, response) => {
    response.json({ status: 'ok' });
  });

  app.get('/api/tasks', async (_request, response, next) => {
    try {
      const tasks = await store.readTasks();
      response.json(tasks.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)));
    } catch (error) {
      next(error);
    }
  });

  app.post('/api/tasks', async (request, response, next) => {
    try {
      const { errors, value } = validateTask(request.body);
      if (Object.keys(errors).length) return response.status(400).json({ message: 'Please check the form.', errors });

      const tasks = await store.readTasks();
      const timestamp = new Date().toISOString();
      const task = { id: crypto.randomUUID(), ...value, createdAt: timestamp, updatedAt: timestamp };
      tasks.push(task);
      await store.writeTasks(tasks);
      return response.status(201).json(task);
    } catch (error) {
      return next(error);
    }
  });

  app.put('/api/tasks/:id', async (request, response, next) => {
    try {
      const tasks = await store.readTasks();
      const index = tasks.findIndex((task) => task.id === request.params.id);
      if (index === -1) return response.status(404).json({ message: 'Task not found.' });

      const { errors, value } = validateTask(request.body, tasks[index]);
      if (Object.keys(errors).length) return response.status(400).json({ message: 'Please check the form.', errors });

      const updatedTask = { ...tasks[index], ...value, updatedAt: new Date().toISOString() };
      tasks[index] = updatedTask;
      await store.writeTasks(tasks);
      return response.json(updatedTask);
    } catch (error) {
      return next(error);
    }
  });

  app.delete('/api/tasks/:id', async (request, response, next) => {
    try {
      const tasks = await store.readTasks();
      const task = tasks.find((item) => item.id === request.params.id);
      if (!task) return response.status(404).json({ message: 'Task not found.' });

      await store.writeTasks(tasks.filter((item) => item.id !== request.params.id));
      return response.json({ message: 'Task deleted.', task });
    } catch (error) {
      return next(error);
    }
  });

  app.use((error, _request, response, _next) => {
    console.error(error);
    response.status(500).json({ message: 'Something went wrong on the server. Please try again.' });
  });

  return app;
}
