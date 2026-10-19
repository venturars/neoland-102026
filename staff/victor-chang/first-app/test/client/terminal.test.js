import { test } from 'node:test'
import assert from 'node:assert/strict'
import { spawnSync } from 'node:child_process'
import { mkdtempSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { fileURLToPath } from 'node:url'

const CLI_PATH = fileURLToPath(new URL('../../client/terminal/index.js', import.meta.url))

const createDbPath = () => join(mkdtempSync(join(tmpdir(), 'first-app-')), 'users.db')

const cli = (dbPath, args, env = {}) => {
  const { status, stdout, stderr } = spawnSync(process.execPath, ['--no-warnings', CLI_PATH, ...args], {
    encoding: 'utf8',
    env: { ...process.env, DEBUG: '', ...env, DB_PATH: dbPath },
  })
  return { status, stdout, stderr, output: stdout && JSON.parse(stdout), error: stderr && JSON.parse(stderr.split('\n')[0]).error }
}

test('CLI-1: create prints the new user', () => {
  const { status, output } = cli(createDbPath(), ['create', 'Ana', 'ana@x.com'])
  assert.equal(status, 0)
  assert.deepEqual(output, { id: 1, name: 'Ana', email: 'ana@x.com' })
})

test('CLI-2: delete prints the deleted id', () => {
  const dbPath = createDbPath()
  cli(dbPath, ['create', 'Ana', 'ana@x.com'])
  const { status, output } = cli(dbPath, ['delete', '1'])
  assert.equal(status, 0)
  assert.deepEqual(output, { deleted: 1 })
})

test('CLI-3: unknown command exits 2', () => {
  const { status, error } = cli(createDbPath(), ['foo'])
  assert.equal(status, 2)
  assert.equal(error.code, 'VALIDATION')
  assert.deepEqual(error.details, { field: 'command' })
})

test('CLI-4: wrong argument count exits 2 with the usage', () => {
  const { status, error } = cli(createDbPath(), ['update', 'Victor C', 'victor@x.com'])
  assert.equal(status, 2)
  assert.equal(error.code, 'VALIDATION')
  assert.deepEqual(error.details, { field: 'args' })
  assert.equal(error.message, 'usage: update <id> <name> <email>')
})

test('CLI-5: non-numeric id exits 2', () => {
  const { status, error } = cli(createDbPath(), ['get', 'abc'])
  assert.equal(status, 2)
  assert.deepEqual(error.details, { field: 'id' })
})

test('CLI-6: missing user exits 3', () => {
  const { status, error } = cli(createDbPath(), ['get', '9'])
  assert.equal(status, 3)
  assert.equal(error.code, 'NOT_FOUND')
})

test('CLI-7: duplicate email exits 4', () => {
  const dbPath = createDbPath()
  cli(dbPath, ['create', 'Ana', 'ana@x.com'])
  const { status, error } = cli(dbPath, ['create', 'Bob', 'ana@x.com'])
  assert.equal(status, 4)
  assert.equal(error.code, 'DUPLICATE')
})

test('CLI-8: unexpected failure exits 1 without a stack', () => {
  const { status, error, stderr } = cli(join(tmpdir(), 'missing-folder-first-app', 'users.db'), ['list'])
  assert.equal(status, 1)
  assert.equal(error.code, 'SYSTEM')
  assert.equal(error.message, 'unexpected error')
  assert.equal(stderr.trim().split('\n').length, 1)
})

test('CLI-9: DEBUG=1 also prints the stack', () => {
  const { status, stderr } = cli(join(tmpdir(), 'missing-folder-first-app', 'users.db'), ['list'], { DEBUG: '1' })
  assert.equal(status, 1)
  assert.match(stderr, /\n\s+at /)
})
