import { safe } from './safe.js'

export const findUserById = (db) => safe((id) => {
  const row = db.prepare('SELECT * FROM users WHERE id = ?').get(id)
  return row ? { ...row } : null
})
