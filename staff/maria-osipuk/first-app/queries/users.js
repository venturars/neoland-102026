import { readFileSync } from "node:fs";

import database from "../db/connection.js";

const createUsersTableQuery = readFileSync(
  new URL("./queries/create-users-table.sql", import.meta.url),
  "utf8",
);
const deleteUserQuery = readFileSync(
  new URL("./queries/delete.sql", import.meta.url),
  "utf8",
);
const findUserByEmailQuery = readFileSync(
  new URL("./queries/find-by-email.sql", import.meta.url),
  "utf8",
);
const findUserByIdQuery = readFileSync(
  new URL("./queries/find-by-id.sql", import.meta.url),
  "utf8",
);
const insertUserQuery = readFileSync(
  new URL("./queries/insert.sql", import.meta.url),
  "utf8",
);
const listUsersQuery = readFileSync(
  new URL("./queries/list.sql", import.meta.url),
  "utf8",
);
const updateUserQuery = readFileSync(
  new URL("./queries/update.sql", import.meta.url),
  "utf8",
);

export function createUsersTable() {
  database.exec(createUsersTableQuery);
}

export function findUserByEmail(email) {
  return database.prepare(findUserByEmailQuery).get({ email });
}

export function findUserById(id) {
  return database.prepare(findUserByIdQuery).get({ id });
}

export function listUserRows() {
  return database.prepare(listUsersQuery).all();
}

export function deleteUserRow(id) {
  database.prepare(deleteUserQuery).run({ id });
}

export function updateUserRow({ id, name, email, updatedAt }) {
  database.prepare(updateUserQuery).run({ id, name, email, updatedAt });

  return findUserById(id);
}

export function insertUser({ name, email, createdAt, updatedAt }) {
  const result = database
    .prepare(insertUserQuery)
    .run({ name, email, createdAt, updatedAt });

  return findUserById(result.lastInsertRowid);
}
