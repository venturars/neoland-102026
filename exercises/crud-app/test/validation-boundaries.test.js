import test from 'node:test';
import assert from 'node:assert/strict';
import { DatabaseSync } from 'node:sqlite';
import { initializeDatabase } from '../src/db/initialize.js';
import { createUsersRepository } from '../src/db/users-repository.js';
import { createUser } from '../src/logic/create-user.js';
import { updateUser } from '../src/logic/update-user.js';

function withUsers(check) {
  const database = new DatabaseSync(':memory:');
  try {
    initializeDatabase(database);
    check(createUsersRepository(database));
  } finally {
    database.close();
  }
}

test('exact name and email boundaries accept limits and reject overflow', () => {
  withUsers(users => {
    const email254 = 'a'.repeat(248) + '@x.com';
    const created = createUser({ name: 'a'.repeat(100), email: email254 }, users);
    assert.equal(created.ok, true);
    assert.equal(created.data.name.length, 100);
    assert.equal(created.data.email.length, 254);
    const short = createUser({ name: ' A ', email: 'a@b.c' }, users);
    assert.equal(short.ok, true);
    assert.equal(short.data.name, 'A');
    const before = users.listUsers();
    for (const input of [
      { name: 'a'.repeat(101), email: 'other@x.com' },
      { name: 'Valid', email: 'a'.repeat(249) + '@x.com' },
      { name: '   ', email: 'other@x.com' },
    ]) {
      assert.equal(createUser(input, users).error.code, 'VALIDATION_ERROR');
    }
    assert.deepEqual(users.listUsers(), before);
  });
});

test('Unicode is normalized before length checks; invalid writes preserve records', () => {
  withUsers(users => {
    const created = createUser({ name: '😀'.repeat(100), email: 'original@x.com' }, users);
    assert.equal(created.ok, true);
    // Each capital dotted I expands into two Unicode code points when lowercased.
    const expanded = 'İ'.repeat(248) + '@x.com';
    const before = users.listUsers();
    for (const input of [
      { name: 'Valid', email: expanded },
      { name: 'Bad\0Name', email: 'other@x.com' },
      { name: 'Valid', email: 'bad\0@x.com' },
      { name: '😀'.repeat(101), email: 'other@x.com' },
    ]) {
      assert.equal(createUser(input, users).error.code, 'VALIDATION_ERROR');
      assert.equal(updateUser(created.data.id, input, users).error.code, 'VALIDATION_ERROR');
      assert.deepEqual(users.listUsers(), before);
    }
    const normalized = createUser({ name: 'Valid', email: 'İ@X.COM' }, users);
    assert.equal(normalized.ok, true);
    assert.equal(normalized.data.email, 'i\u0307@x.com');
  });
});

test('updating with your own normalized email succeeds and preserves other fields', () => {
  withUsers(users => {
    const original = createUser({ name: 'Ana', email: 'ana@example.com' }, users).data;
    const result = updateUser(original.id, { email: ' ANA@EXAMPLE.COM ' }, users);
    assert.equal(result.ok, true);
    assert.equal(result.data.id, original.id);
    assert.equal(result.data.name, original.name);
    assert.equal(result.data.email, original.email);
    assert.equal(result.data.createdAt, original.createdAt);
    assert.equal(users.listUsers().length, 1);
  });
});

test('failed schema upgrade rolls back table changes and preserves every record', () => {
  const database = new DatabaseSync(':memory:');
  try {
    // A permissive legacy table contains a row that the new constraints reject.
    database.exec(`CREATE TABLE users (id INTEGER PRIMARY KEY, name TEXT NOT NULL, email TEXT NOT NULL UNIQUE);
      INSERT INTO users VALUES (1, 'Valid', 'valid@example.com'), (2, '', 'invalid@example.com');`);
    const beforeSchema = database.prepare("SELECT sql FROM sqlite_schema WHERE name = 'users'").get();
    const beforeRows = database.prepare('SELECT * FROM users ORDER BY id').all();
    assert.throws(() => initializeDatabase(database), /CHECK constraint failed/);
    assert.deepEqual(database.prepare("SELECT sql FROM sqlite_schema WHERE name = 'users'").get(), beforeSchema);
    assert.deepEqual(database.prepare('SELECT * FROM users ORDER BY id').all(), beforeRows);
    assert.equal(database.prepare("SELECT name FROM sqlite_schema WHERE name = 'users_before_timestamps'").get(), undefined);
    // A new transaction succeeds, proving rollback did not leave one open.
    database.exec('BEGIN; ROLLBACK;');
  } finally {
    database.close();
  }
});
