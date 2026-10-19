import { findUserById } from './findUserById.js'

export const modifyUser = (db) => (id, { name, email }) => {
  db.prepare('UPDATE users SET name = ?, email = ? WHERE id = ?').run(name, email, id)
  return findUserById(db)(id)
}
