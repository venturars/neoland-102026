export const findUserByEmail = (db) => (email) => {
  const row = db.prepare('SELECT * FROM users WHERE email = ?').get(email)
  return row ? { ...row } : null
}
