import { readFileSync } from 'node:fs';

const schema = readFileSync(new URL('./schema.sql', import.meta.url), 'utf8');

export function initializeDatabase(database) {
  const columns = database.prepare('PRAGMA table_info(users)').all();
  // Upgrade the original three-column table while preserving IDs and contact data.
  const legacy = columns.length > 0 && !columns.some(column => column.name === 'createdAt');
  database.exec('BEGIN');
  try {
    if (legacy) database.exec('ALTER TABLE users RENAME TO users_before_timestamps');
    database.exec(schema);
    if (legacy) {
      database.exec(`
        INSERT INTO users (id, name, email)
        SELECT id, name, email FROM users_before_timestamps;
        DROP TABLE users_before_timestamps;
      `);
    }
    database.exec('COMMIT');
  } catch (error) {
    database.exec('ROLLBACK');
    throw error;
  }
}
