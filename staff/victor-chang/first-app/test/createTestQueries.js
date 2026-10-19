import { openDatabase } from '../db/sqlite.js'
import { createQueries } from '../query/index.js'

export const createTestQueries = (...users) => {
  const db = openDatabase(':memory:')
  const queries = createQueries(db)
  users.forEach((user) => queries.insertUser(user))
  return { db, queries }
}
