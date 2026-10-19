import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, readFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { DatabaseSync } from 'node:sqlite';
import { createUsersRepository } from '../src/db/users-repository.js';

test('repository CRUD, constraints, and persistence in a temporary database', () => {
  const directory = mkdtempSync(join(tmpdir(), 'crud-app-test-'));
  const path = join(directory, 'test.sqlite');
  let database;

  try {
    database = new DatabaseSync(path);
    database.exec(readFileSync(new URL('../src/db/schema.sql', import.meta.url), 'utf8'));
    let users = createUsersRepository(database);
    assert.deepEqual(users.listUsers(), []);
    assert.equal(users.findUserById(999), undefined);

    const ana = users.createUser({ name: "Ana O'Neil", email: 'ana@example.com' });
    const bob = users.createUser({ name: 'Bob', email: 'bob@example.com' });
    assert.equal(Number.isInteger(ana.id), true);
    assert.equal(Object.getPrototypeOf(ana), Object.prototype);
    assert.deepEqual(users.findUserById(ana.id), ana);
    assert.deepEqual(users.listUsers(), [ana, bob]);
    assert.throws(() => users.createUser({ name: 'Duplicate', email: 'ANA@example.com' }), /UNIQUE/);
    assert.throws(() => users.updateUser(bob.id, { name: 'Bob', email: ana.email }), /UNIQUE/);
    assert.deepEqual(users.findUserById(bob.id), bob);

    const updated = users.updateUser(ana.id, { name: 'Ana Lopez', email: 'ana.lopez@example.com' });
    assert.deepEqual(updated, { ...updated, id: ana.id, name: 'Ana Lopez', email: 'ana.lopez@example.com' });
    assert.equal(users.updateUser(999, { name: 'Missing', email: 'missing@example.com' }), undefined);
    assert.equal(users.deleteUser(999), undefined);

    database.close();
    database = undefined;
    database = new DatabaseSync(path);
    users = createUsersRepository(database);
    assert.deepEqual(users.findUserById(ana.id), updated);
    assert.deepEqual(users.deleteUser(ana.id), { id: ana.id });
    assert.equal(users.findUserById(ana.id), undefined);
    assert.deepEqual(users.deleteUser(bob.id), { id: bob.id });
    assert.deepEqual(users.listUsers(), []);
  } finally {
    if (database) database.close();
    rmSync(directory, { recursive: true, force: true });
  }
});
