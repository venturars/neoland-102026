import { test } from 'node:test'
import assert from 'node:assert/strict'
import { safe } from '../../query/safe.js'
import { NotFoundError } from '../../logic/errors.js'
import { createTestQueries } from '../createTestQueries.js'

test('SQ-1: passes results through', () => {
  assert.equal(safe(() => 42)(), 42)
})

test('SQ-2: passes app errors through unchanged', () => {
  const error = new NotFoundError('user not found', { resource: 'user', id: 1 })
  assert.throws(safe(() => { throw error }), (thrown) => thrown === error)
})

test('SQ-3: turns a UNIQUE violation into a duplicate error', () => {
  const { queries } = createTestQueries({ name: 'A', email: 'a@x.com' })
  assert.throws(() => queries.insertUser({ name: 'B', email: 'a@x.com' }), (error) => {
    assert.equal(error.code, 'DUPLICATE')
    assert.deepEqual(error.details, { field: 'email', value: 'a@x.com' })
    assert.ok(error.cause)
    return true
  })
})

test('SQ-4: turns any other driver error into a system error', () => {
  const { db, queries } = createTestQueries()
  db.exec('DROP TABLE users')
  assert.throws(() => queries.findAllUsers(), (error) => {
    assert.equal(error.code, 'SYSTEM')
    assert.equal(error.message, 'database error')
    assert.ok(error.cause)
    return true
  })
})
