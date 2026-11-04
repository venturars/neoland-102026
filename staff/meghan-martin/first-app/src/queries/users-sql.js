// The SQL sentences, named so the database program can find them.
// The parameters stay :id, :name, and :email.

export const USER_QUERIES = {
  createUsersTable: `CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY,
  name TEXT NOT NULL,
  email VARCHAR(64) NOT NULL UNIQUE,
  createdAt TEXT NOT NULL DEFAULT (datetime('now', 'localtime')),
  updatedAt TEXT NOT NULL DEFAULT (datetime('now', 'localtime'))
)`,
  listTableNames: "SELECT name FROM sqlite_master WHERE type = 'table'",
  findById: "SELECT * FROM users WHERE id = :id",
  findByEmail: "SELECT * FROM users WHERE email = :email",
  insert: `INSERT INTO users (name, email)
VALUES (:name, :email)
RETURNING *`,
  update: `UPDATE users
SET name = :name,
    email = :email,
    updatedAt = datetime('now', 'localtime')
WHERE id = :id
RETURNING *`,
  remove: "DELETE FROM users WHERE id = :id",
  findAll: "SELECT * FROM users ORDER BY id",
};
