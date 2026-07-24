import assert from 'node:assert/strict';
import { after, before, test } from 'node:test';
import { rm } from 'node:fs/promises';
import path from 'node:path';
import request from 'supertest';
import { createApp } from '../src/app.js';
import { createTaskStore } from '../src/store.js';
import { createAuthStore } from '../src/authStore.js';

const tasksFile = path.resolve('data/tasks.test.json'); const usersFile = path.resolve('data/users.test.json');
const app = createApp({ store: createTaskStore(tasksFile), authStore: createAuthStore(usersFile) }); const agent = request.agent(app); let taskId;
before(async()=>{ await Promise.all([rm(tasksFile,{force:true}),rm(usersFile,{force:true})]); }); after(async()=>{ await Promise.all([rm(tasksFile,{force:true}),rm(usersFile,{force:true})]); });
test('protected routes reject anonymous users', async()=>{ await request(app).get('/api/auth/me').expect(401); await request(app).get('/api/tasks').expect(401); });
test('signup validates input and hashes the password', async()=>{ await request(app).post('/api/auth/signup').send({name:'A',email:'wrong',password:'123'}).expect(400); const response=await request(app).post('/api/auth/signup').send({name:'Amir Latif',email:'amir@example.com',password:'Secure123'}).expect(201); assert.equal(response.body.user.email,'amir@example.com'); assert.equal(response.body.user.passwordHash,undefined); await request(app).post('/api/auth/signup').send({name:'Amir Latif',email:'amir@example.com',password:'Secure123'}).expect(409); });
test('login rejects wrong credentials and creates a secure session', async()=>{ await agent.post('/api/auth/login').send({email:'amir@example.com',password:'wrong-password'}).expect(401); const response=await agent.post('/api/auth/login').send({email:'amir@example.com',password:'Secure123'}).expect(200); assert.match(response.headers['set-cookie'][0],/HttpOnly/); await agent.get('/api/auth/me').expect(200); });
test('authenticated user can complete full task CRUD', async()=>{ const created=await agent.post('/api/tasks').send({title:'Test protected CRUD',description:'Private task',priority:'high',dueDate:'2026-08-01',completed:false}).expect(201); taskId=created.body.id; const listed=await agent.get('/api/tasks').expect(200); assert.equal(listed.body.length,1); const updated=await agent.put(`/api/tasks/${taskId}`).send({...created.body,title:'Updated private task',completed:true}).expect(200); assert.equal(updated.body.completed,true); await agent.delete(`/api/tasks/${taskId}`).expect(200); });
test('logout clears the session and blocks protected access', async()=>{ const response=await agent.post('/api/auth/logout').expect(200); assert.match(response.headers['set-cookie'][0],/momentum_session=;/); await agent.get('/api/tasks').expect(401); });