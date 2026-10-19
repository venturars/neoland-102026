import { initializeDatabase } from '../src/db/initialize.js';
import { openDatabase } from '../src/db/connection.js';

const database = openDatabase();

try {
  initializeDatabase(database);
  console.log('Database initialized: data/app.sqlite');
} finally {
  database.close();
}
