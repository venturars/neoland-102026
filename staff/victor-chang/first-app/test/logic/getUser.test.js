import { test } from 'node:test'
import assert from 'node:assert/strict'
import { getUser } from '../../logic/getUser.js'
import { createTestQueries } from '../createTestQueries.js'

test('GU-1: returns the user by id', () => {
  const { queries } = createTestQueries({ name: 'Ana', email: 'ana@x.com' })
  assert.deepEqual(getUser(queries)(1), { id: 1, name: 'Ana', email: 'ana@x.com' })
})

test('GU-2: rejects a missing user', () => {
  const { queries } = createTestQueries()
  assert.throws(() => getUser(queries)(9), { code: 'NOT_FOUND', details: { resource: 'user', id: 9 } })
})
