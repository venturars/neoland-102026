import { findUserById } from './findUserById.js'

export const insertUser = (db) => ({ name, email }) => {
  const { lastInsertRowid } = db.prepare('INSERT INTO users (name, email) VALUES (?, ?)').run(name, email)
  return findUserById(db)(Number(lastInsertRowid))
}
