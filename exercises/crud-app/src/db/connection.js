import { mkdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { DatabaseSync } from 'node:sqlite';

const dataDirectory = new URL('../../data/', import.meta.url);
const databasePath = fileURLToPath(new URL('app.sqlite', dataDirectory));

export function openDatabase() {
  mkdirSync(dataDirectory, { recursive: true });
  return new DatabaseSync(databasePath);
}
