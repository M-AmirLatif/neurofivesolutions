import { mkdir, readFile, rename, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const directory = path.dirname(fileURLToPath(import.meta.url));
const defaultFile = path.resolve(directory, '../data/users.json');

export function createAuthStore(filePath = process.env.USERS_FILE || defaultFile) {
  let queue = Promise.resolve();
  async function ensureFile() {
    await mkdir(path.dirname(filePath), { recursive: true });
    try { await readFile(filePath, 'utf8'); }
    catch (error) { if (error.code !== 'ENOENT') throw error; await writeFile(filePath, '[]', 'utf8'); }
  }
  async function readUsers() { await ensureFile(); return JSON.parse(await readFile(filePath, 'utf8')); }
  function writeUsers(users) {
    queue = queue.then(async () => { await ensureFile(); const temporary = `${filePath}.tmp`; await writeFile(temporary, JSON.stringify(users, null, 2), 'utf8'); await rename(temporary, filePath); });
    return queue;
  }
  return { readUsers, writeUsers };
}