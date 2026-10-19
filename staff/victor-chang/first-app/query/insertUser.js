import { safe } from './safe.js'
import { findUserById } from './findUserById.js'

export const insertUser = (db) => safe(({ name, email }) => {
  const { lastInsertRowid } = db.prepare('INSERT INTO users (name, email) VALUES (?, ?)').run(name, email)
  return findUserById(db)(Number(lastInsertRowid))
})
