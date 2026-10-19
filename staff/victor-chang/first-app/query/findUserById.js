export const findUserById = (db) => (id) => {
  const row = db.prepare('SELECT * FROM users WHERE id = ?').get(id)
  return row ? { ...row } : null
}
