import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, readFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { DatabaseSync } from 'node:sqlite';
import { createUsersRepository } from '../src/db/users-repository.js';
import { createUser } from '../src/logic/create-user.js';
import { updateUser } from '../src/logic/update-user.js';
import { deleteUser } from '../src/logic/delete-user.js';
import { listUsers } from '../src/logic/list-users.js';

test('business rules with a temporary SQLite database', () => {
  const directory = mkdtempSync(join(tmpdir(), 'crud-logic-'));
  let database;
  try {
    database = new DatabaseSync(join(directory, 'test.sqlite'));
    database.exec(readFileSync(new URL('../src/db/schema.sql', import.meta.url), 'utf8'));
    const users = createUsersRepository(database);
    assert.deepEqual(listUsers(users), { ok: true, data: [] });
    const created = createUser({ name: ' Ana ', email: ' ANA@EXAMPLE.COM ' }, users);
    assert.equal(created.ok, true);
    const id = created.data.id;
    assert.deepEqual(created.data, { ...created.data, id, name: 'Ana', email: 'ana@example.com' });
    for (const input of [null, [], {}, { name: '', email: 'x@y.com' },
      { name: 'a'.repeat(101), email: 'x@y.com' }, { name: 'Ana', email: 'invalid' },
      { name: 'Ana', email: 'a'.repeat(250) + '@x.com' },
      { name: 'Ana', email: 'a@x.com', extra: true }]) {
      assert.equal(createUser(input, users).error.code, 'VALIDATION_ERROR');
    }
    assert.equal(createUser({ name: 'Other', email: 'ANA@example.com' }, users).error.code, 'EMAIL_IN_USE');
    const bob = createUser({ name: 'Bob', email: 'bob@example.com' }, users).data;
    assert.equal(updateUser(bob.id, { email: 'ANA@example.com' }, users).error.code, 'EMAIL_IN_USE');
    assert.deepEqual(users.findUserById(bob.id), bob);
    const changed = updateUser(id, { name: ' Ana Lopez ' }, users).data;
    assert.deepEqual(changed, { ...changed, id, name: 'Ana Lopez', email: 'ana@example.com' });
    assert.equal(updateUser(id, { email: ' NEW@EXAMPLE.COM ' }, users).data.email, 'new@example.com');
    for (const input of [{}, { name: null }, { name: undefined }, { id: 4 }]) {
      assert.equal(updateUser(id, input, users).error.code, 'VALIDATION_ERROR');
    }
    for (const invalid of [0, -1, 1.5, '1', null, NaN]) {
      assert.equal(updateUser(invalid, { name: 'Valid' }, users).error.code, 'VALIDATION_ERROR');
      assert.equal(deleteUser(invalid, users).error.code, 'VALIDATION_ERROR');
    }
    assert.equal(updateUser(999, { name: 'Missing' }, users).error.code, 'NOT_FOUND');
    assert.equal(deleteUser(999, users).error.code, 'NOT_FOUND');
    assert.deepEqual(listUsers(users).data.map(user => user.id), [id, bob.id]);
    assert.deepEqual(deleteUser(id, users), { ok: true, data: { id } });
    assert.equal(deleteUser(id, users).error.code, 'NOT_FOUND');
    deleteUser(bob.id, users);
    assert.deepEqual(listUsers(users), { ok: true, data: [] });
    database.close();
    database = undefined;
    assert.throws(() => createUser({ name: 'Valid', email: 'valid@example.com' }, users));
  } finally {
    if (database) database.close();
    rmSync(directory, { recursive: true, force: true });
  }
});
