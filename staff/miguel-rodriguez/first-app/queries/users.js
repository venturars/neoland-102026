import { db } from "../db/connection.js";

export function createUsersTable() {
  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY,
      name TEXT NOT NULL,
      email VARCHAR(64) NOT NULL UNIQUE,
      createdAt TEXT NOT NULL DEFAULT (datetime('now', 'localtime')),
      updatedAt TEXT NOT NULL DEFAULT (datetime('now', 'localtime'))
    );
  `);
}

export function findById(id) {
  return db.prepare("SELECT * FROM users WHERE id = :id").get({ id });
}

export function findByEmail(email) {
  return db.prepare("SELECT * FROM users WHERE email = :email").get({ email });
}

export function insert({ name, email }) {
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

export function update({ id, name, email }) {
  return db
    .prepare(
      `
        UPDATE users
        SET name = :name,
            email = :email,
            updatedAt = datetime('now', 'localtime')
        WHERE id = :id
        RETURNING *
      `,
    )
    .get({ id, name, email });
}

export function remove(id) {
  return db.prepare("DELETE FROM users WHERE id = :id").run({ id });
}

export function findAll() {
  return db.prepare("SELECT * FROM users ORDER BY id").all();
}
