import path from 'node:path';
import { existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import express from 'express';
import { createApp } from './app.js';

const app = createApp();
const port = process.env.PORT || 5000;
const directory = path.dirname(fileURLToPath(import.meta.url));
const clientBuild = path.resolve(directory, '../../client/dist');

if (existsSync(clientBuild)) {
  app.use(express.static(clientBuild));
  app.get('*splat', (_request, response) => response.sendFile(path.join(clientBuild, 'index.html')));
}

app.listen(port, () => {
  console.log(`Momentum is running at http://localhost:${port}`);
});
