import test from 'node:test';
import assert from 'node:assert/strict';
import { cpSync, mkdtempSync, mkdirSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { spawnSync } from 'node:child_process';

// Copy source into a disposable project so its fixed database path stays isolated.
test('terminal CRUD and direct JavaScript client share business logic', () => {
  const root = mkdtempSync(join(tmpdir(), 'crud-clients-'));
  try {
    cpSync(new URL('../src/', import.meta.url), join(root, 'src'), { recursive: true });
    cpSync(new URL('../package.json', import.meta.url), join(root, 'package.json'));
    mkdirSync(join(root, 'scripts'));
    cpSync(new URL('../scripts/init-db.js', import.meta.url), join(root, 'scripts/init-db.js'));
    function run(args) {
      const result = spawnSync(process.execPath, args, { cwd: root, encoding: 'utf8' });
      assert.ifError(result.error);
      return result;
    }
    function cli(...args) { return run(['src/cli.js', ...args]); }
    assert.equal(cli('--help').status, 0);
    assert.equal(cli('list').status, 1); // Not initialized yet.
    assert.equal(run(['scripts/init-db.js']).status, 0);
    assert.equal(run(['scripts/init-db.js']).status, 0);
    assert.deepEqual(JSON.parse(cli('list').stdout), { ok: true, data: [] });
    const created = cli('create', '--name', ' Ana ', '--email', 'ANA@example.com');
    assert.equal(created.status, 0);
    const user = JSON.parse(created.stdout).data;
    assert.deepEqual(user, { ...user, id: user.id, name: 'Ana', email: 'ana@example.com' });
    const duplicate = cli('create', '--name', 'Other', '--email', 'ana@example.com');
    assert.equal(duplicate.status, 1);
    assert.match(duplicate.stderr, /EMAIL_IN_USE/);
    const invalid = cli('create', '--name', '', '--email', 'bad');
    assert.equal(invalid.status, 1);
    assert.match(invalid.stderr, /VALIDATION_ERROR/);
    assert.equal(cli('update', String(user.id), '--name', 'Ana Lopez').status, 0);
    assert.equal(JSON.parse(cli('list').stdout).data[0].name, 'Ana Lopez');
    for (const args of [['delete'], ['delete', '1x'], ['list', '--name', 'Ana'], ['unknown']]) {
      assert.equal(cli(...args).status, 1);
    }
    const direct = run(['--input-type=module', '-e', `
      import assert from 'node:assert/strict';
      import { openApp } from './src/app.js';
      const app = openApp();
      try {
        const result = app.listUsers();
        assert.equal(result.ok, true);
        assert.equal(result.data[0].name, 'Ana Lopez');
        const created = app.createUser({ name: 'Bob', email: 'bob@example.com' });
        assert.equal(created.ok, true);
        assert.equal(app.updateUser(created.data.id, { name: 'Bobby' }).data.name, 'Bobby');
        assert.equal(app.deleteUser(created.data.id).ok, true);
      } finally { app.close(); }
    `]);
    assert.equal(direct.status, 0, direct.stderr);
    assert.equal(direct.stdout, ''); // The shared module never prints results.
    assert.equal(cli('delete', String(user.id)).status, 0);
    assert.equal(cli('delete', String(user.id)).status, 1);
    assert.deepEqual(JSON.parse(cli('list').stdout).data, []);
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
});
