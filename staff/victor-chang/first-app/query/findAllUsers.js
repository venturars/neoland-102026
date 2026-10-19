export const findAllUsers = (db) => () =>
  db.prepare('SELECT * FROM users ORDER BY id').all().map((row) => ({ ...row }))
