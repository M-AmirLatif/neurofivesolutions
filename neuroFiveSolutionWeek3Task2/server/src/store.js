import { mkdir, readFile, rename, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const directory = path.dirname(fileURLToPath(import.meta.url));
const defaultFile = path.resolve(directory, '../data/submissions.json');

export function createSubmissionStore(filePath = process.env.DATA_FILE || defaultFile) {
  let queue = Promise.resolve();
  async function ensureFile() {
    await mkdir(path.dirname(filePath), { recursive: true });
    try { await readFile(filePath, 'utf8'); }
    catch (error) { if (error.code !== 'ENOENT') throw error; await writeFile(filePath, '[]', 'utf8'); }
  }
  async function readSubmissions() { await ensureFile(); return JSON.parse(await readFile(filePath, 'utf8')); }
  function writeSubmissions(items) {
    queue = queue.then(async () => { await ensureFile(); const temporary = `${filePath}.tmp`; await writeFile(temporary, JSON.stringify(items, null, 2), 'utf8'); await rename(temporary, filePath); });
    return queue;
  }
  return { readSubmissions, writeSubmissions };
}
