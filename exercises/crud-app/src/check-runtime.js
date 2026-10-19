import { DatabaseSync } from 'node:sqlite';

if (typeof DatabaseSync !== 'function') {
  throw new Error('The SQLite API is unavailable.');
}

console.log(`Node.js ${process.version}: JavaScript modules and node:sqlite are available.`);
