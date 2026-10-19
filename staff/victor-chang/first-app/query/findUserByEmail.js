import { safe } from './safe.js'

export const findUserByEmail = (db) => safe((email) => {
  const row = db.prepare('SELECT * FROM users WHERE email = ?').get(email)
  return row ? { ...row } : null
})
