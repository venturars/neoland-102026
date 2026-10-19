import test from 'node:test';
import assert from 'node:assert/strict';
import { DatabaseSync } from 'node:sqlite';
import { initializeDatabase } from '../src/db/initialize.js';
import { createUsersRepository } from '../src/db/users-repository.js';

test('timestamps, email lookup, and repeatable upgrade preserve existing users', () => {
  const database = new DatabaseSync(':memory:');
  try {
    database.exec(`CREATE TABLE users (id INTEGER PRIMARY KEY, name TEXT NOT NULL, email TEXT NOT NULL UNIQUE);
      INSERT INTO users VALUES (7, 'Existing', 'existing@example.com');`);
    initializeDatabase(database);
    let users = createUsersRepository(database);
    const existing = users.findUserById(7);
    assert.equal(existing.name, 'Existing');
    assert.equal(existing.email, 'existing@example.com');
    assert.match(existing.createdAt, /^\d{4}-\d{2}-\d{2} /);
    assert.equal(existing.createdAt, existing.updatedAt);
    initializeDatabase(database);
    users = createUsersRepository(database);
    assert.deepEqual(users.findUserById(7), existing);
    assert.deepEqual(users.findUserByEmail('EXISTING@example.com'), existing);
    assert.equal(users.findUserByEmail('absent@example.com'), undefined);
    const fresh = users.createUser({ name: 'New', email: 'new@example.com' });
    assert.match(fresh.createdAt, /^\d{4}-\d{2}-\d{2} /);
    assert.equal(fresh.createdAt, fresh.updatedAt);
    // An old timestamp proves update refreshes it, without a timing-dependent sleep.
    database.prepare("UPDATE users SET updatedAt = '2000-01-01 00:00:00' WHERE id = ?").run(fresh.id);
    const updated = users.updateUser(fresh.id, { name: 'Updated', email: fresh.email });
    assert.equal(updated.createdAt, fresh.createdAt);
    assert.ok(updated.updatedAt > '2000-01-01 00:00:00');
    assert.deepEqual(users.listUsers(), [existing, updated]);
  } finally {
    database.close();
  }
});
