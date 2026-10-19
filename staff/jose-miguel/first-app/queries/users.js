import { db } from "../db/connection.js";

export function createUsersTable() {
  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name VARCHAR(100) NOT NULL,
      email VARCHAR(255) NOT NULL UNIQUE,
      created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
    )
  `);
}

createUsersTable();

export function findUserById(id) {
  return db.prepare("SELECT * FROM users WHERE id = :id").get({ id });
}

export function findUserByEmail(email) {
  return db
    .prepare("SELECT * FROM users WHERE email = :email")
    .get({ email });
}

export function insertUser(name, email) {
  return db
    .prepare(
      `
        INSERT INTO users (name, email)
        VALUES (:name, :email)
        RETURNING *
      `,
    )
    .get({ name, email });
}

export function updateUser(id, name, email) {
  return db
    .prepare(
      `
        UPDATE users
        SET name = :name,
            email = :email,
            updated_at = CURRENT_TIMESTAMP
        WHERE id = :id
        RETURNING *
      `,
    )
    .get({ id, name, email });
}

export function deleteUser(id) {
  return db.prepare("DELETE FROM users WHERE id = :id").run({ id });
}

export function listUsers() {
  return db.prepare("SELECT * FROM users ORDER BY id").all();
}
