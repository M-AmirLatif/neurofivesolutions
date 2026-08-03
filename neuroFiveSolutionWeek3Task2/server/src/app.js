import crypto from 'node:crypto';
import { mkdirSync } from 'node:fs';
import { unlink } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import cors from 'cors';
import express from 'express';
import multer from 'multer';
import { createSubmissionStore } from './store.js';
import { validateSubmission } from './validation.js';

const directory = path.dirname(fileURLToPath(import.meta.url));
const defaultUploads = path.resolve(directory, '../uploads');
const allowedTypes = new Set(['image/jpeg', 'image/png', 'image/webp']);

export function createApp({ store = createSubmissionStore(), uploadDirectory = defaultUploads } = {}) {
  mkdirSync(uploadDirectory, { recursive: true });
  const upload = multer({
    storage: multer.diskStorage({
      destination: (_request, _file, callback) => { mkdirSync(uploadDirectory, { recursive: true }); callback(null, uploadDirectory); },
      filename: (_request, file, callback) => callback(null, `${Date.now()}-${crypto.randomUUID()}${path.extname(file.originalname).toLowerCase()}`)
    }),
    limits: { fileSize: 3 * 1024 * 1024, files: 1 },
    fileFilter: (_request, file, callback) => allowedTypes.has(file.mimetype) ? callback(null, true) : callback(new multer.MulterError('LIMIT_UNEXPECTED_FILE', 'coverImage'))
  });
  const app = express();
  app.use(cors({ origin: 'http://localhost:5173' }));
  app.use('/uploads', express.static(uploadDirectory, { index: false, maxAge: '1h' }));
  app.get('/api/health', (_request, response) => response.json({ status: 'ok' }));
  app.get('/api/submissions', async (_request, response, next) => {
    try { const items = await store.readSubmissions(); response.json(items.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))); }
    catch (error) { next(error); }
  });
  app.post('/api/submissions', upload.single('coverImage'), async (request, response, next) => {
    try {
      const { errors, value } = validateSubmission(request.body);
      if (!request.file) errors.coverImage = 'Upload a JPG, PNG, or WebP project image.';
      if (Object.keys(errors).length) {
        if (request.file) await unlink(request.file.path).catch(() => {});
        return response.status(400).json({ message: 'Please correct the highlighted fields.', errors });
      }
      const items = await store.readSubmissions();
      const duplicate = items.some((item) => item.email === value.email && item.projectTitle.toLowerCase() === value.projectTitle.toLowerCase());
      if (duplicate) {
        await unlink(request.file.path).catch(() => {});
        return response.status(409).json({ message: 'This project has already been submitted with that email.', errors: { projectTitle: 'Use a different project title or email.' } });
      }
      const submission = { id: crypto.randomUUID(), ...value, imageUrl: `/uploads/${request.file.filename}`, imageName: request.file.originalname, imageSize: request.file.size, createdAt: new Date().toISOString() };
      items.push(submission); await store.writeSubmissions(items);
      return response.status(201).json({ message: 'Project submitted successfully.', submission });
    } catch (error) {
      if (request.file) await unlink(request.file.path).catch(() => {});
      return next(error);
    }
  });
  app.use((error, _request, response, _next) => {
    if (error instanceof multer.MulterError) {
      const message = error.code === 'LIMIT_FILE_SIZE' ? 'Image must be smaller than 3 MB.' : 'Only JPG, PNG, or WebP images are allowed.';
      return response.status(400).json({ message, errors: { coverImage: message } });
    }
    console.error(error); return response.status(500).json({ message: 'The server could not process your submission. Please try again.' });
  });
  return app;
}
