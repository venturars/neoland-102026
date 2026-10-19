export const removeUser = (db) => (id) => {
  db.prepare('DELETE FROM users WHERE id = ?').run(id)
}
