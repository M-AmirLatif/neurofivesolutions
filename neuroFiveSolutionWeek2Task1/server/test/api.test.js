import assert from 'node:assert/strict';
import { after, before, test } from 'node:test';
import { rm } from 'node:fs/promises';
import path from 'node:path';
import request from 'supertest';
import { createApp } from '../src/app.js';
import { createTaskStore } from '../src/store.js';

const filePath = path.resolve('data/tasks.test.json');
const app = createApp({ store: createTaskStore(filePath) });
let taskId;

before(async () => {
  await rm(filePath, { force: true });
});

after(async () => {
  await rm(filePath, { force: true });
});

test('GET returns an empty task collection', async () => {
  const response = await request(app).get('/api/tasks').expect(200);
  assert.deepEqual(response.body, []);
});

test('POST validates and creates a task', async () => {
  await request(app).post('/api/tasks').send({ title: '' }).expect(400);
  const response = await request(app).post('/api/tasks').send({
    title: 'Ship the CRUD project',
    description: 'Test all four actions',
    priority: 'high',
    dueDate: '2026-07-30',
    completed: false
  }).expect(201);
  taskId = response.body.id;
  assert.equal(response.body.title, 'Ship the CRUD project');
});

test('PUT updates an existing task', async () => {
  const response = await request(app).put(`/api/tasks/${taskId}`).send({
    title: 'Ship the polished CRUD project',
    description: 'All actions verified',
    priority: 'medium',
    dueDate: '2026-07-31',
    completed: true
  }).expect(200);
  assert.equal(response.body.completed, true);
});

test('DELETE removes a task', async () => {
  await request(app).delete(`/api/tasks/${taskId}`).expect(200);
  const response = await request(app).get('/api/tasks').expect(200);
  assert.equal(response.body.length, 0);
});
