import { mkdir, readFile, rename, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const currentDirectory = path.dirname(fileURLToPath(import.meta.url));
const defaultFile = path.resolve(currentDirectory, '../data/tasks.json');

export function createTaskStore(filePath = process.env.DATA_FILE || defaultFile) {
  let queue = Promise.resolve();

  async function ensureFile() {
    await mkdir(path.dirname(filePath), { recursive: true });
    try {
      await readFile(filePath, 'utf8');
    } catch (error) {
      if (error.code !== 'ENOENT') throw error;
      await writeFile(filePath, '[]', 'utf8');
    }
  }

  async function readTasks() {
    await ensureFile();
    const content = await readFile(filePath, 'utf8');
    return JSON.parse(content);
  }

  function writeTasks(tasks) {
    queue = queue.then(async () => {
      await ensureFile();
      const temporaryFile = `${filePath}.tmp`;
      await writeFile(temporaryFile, JSON.stringify(tasks, null, 2), 'utf8');
      await rename(temporaryFile, filePath);
    });
    return queue;
  }

  return { readTasks, writeTasks };
}
