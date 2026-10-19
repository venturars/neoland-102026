import { db } from "../db/connection.js";

// One row per user. SQLite assigns id, created_at, and updated_at.
export const createUsersTableSql = `
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    created_at TEXT NOT NULL DEFAULT (datetime('now')),
    updated_at TEXT NOT NULL DEFAULT (datetime('now'))
  )
`;

// Importing this file creates the table when it is missing.
db.exec(createUsersTableSql);

// created_at and updated_at are renamed so the logic file uses createdAt and updatedAt.
const findUserByEmailSql = `
  SELECT
    id,
    name,
    email,
    created_at AS createdAt,
    updated_at AS updatedAt
  FROM users
  WHERE email = ?
`;

const insertSql = `
  INSERT INTO users (name, email)
  VALUES (?, ?)
  RETURNING
    id,
    name,
    email,
    created_at AS createdAt,
    updated_at AS updatedAt
`;

// Look up one user by email. Returns undefined when nobody has that email.
export function findUserByEmail(email) {
  return db.prepare(findUserByEmailSql).get(email);
}

// Save a new user. SQLite fills id, created_at, and updated_at.
export function insert(input) {
  return db.prepare(insertSql).get(input.name, input.email);
}

const listUsersSql = `
  SELECT
    id,
    name,
    email,
    created_at AS createdAt,
    updated_at AS updatedAt
  FROM users
  ORDER BY id
`;

// Return every user, oldest id first.
export function listUsers() {
  return db.prepare(listUsersSql).all();
}

const findUserByIdSql = `
  SELECT
    id,
    name,
    email,
    created_at AS createdAt,
    updated_at AS updatedAt
  FROM users
  WHERE id = ?
`;

// Look up one user by id. Returns undefined when that id does not exist.
export function findUserById(id) {
  return db.prepare(findUserByIdSql).get(id);
}

const updateSql = `
  UPDATE users
  SET
    name = ?,
    email = ?,
    updated_at = datetime('now')
  WHERE id = ?
  RETURNING
    id,
    name,
    email,
    created_at AS createdAt,
    updated_at AS updatedAt
`;

// Change the name and email of one existing user, and refresh updated_at.
export function update(input) {
  return db.prepare(updateSql).get(input.name, input.email, input.id);
}

const removeSql = `
  DELETE FROM users
  WHERE id = ?
  RETURNING
    id,
    name,
    email,
    created_at AS createdAt,
    updated_at AS updatedAt
`;

// Remove one user and return the row that was deleted.
export function remove(input) {
  return db.prepare(removeSql).get(input.id);
}
