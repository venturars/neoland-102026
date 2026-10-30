import { readFileSync } from "node:fs";

import { database } from "../db/connection.js";

const createUsersTableUrl = new URL(
  "./queries/create-users-table.sql",
  import.meta.url,
);
const createUsersTableQuery = readFileSync(createUsersTableUrl, "utf8");

const deleteUserUrl = new URL("./queries/delete.sql", import.meta.url);
const deleteUserQuery = readFileSync(deleteUserUrl, "utf8");

const findUserByEmailUrl = new URL(
  "./queries/find-by-email.sql",
  import.meta.url,
);
const findUserByEmailQuery = readFileSync(findUserByEmailUrl, "utf8");

const findUserByIdUrl = new URL("./queries/find-by-id.sql", import.meta.url);
const findUserByIdQuery = readFileSync(findUserByIdUrl, "utf8");

const insertUserUrl = new URL("./queries/insert.sql", import.meta.url);
const insertUserQuery = readFileSync(insertUserUrl, "utf8");

const listUsersUrl = new URL("./queries/list.sql", import.meta.url);
const listUsersQuery = readFileSync(listUsersUrl, "utf8");

const updateUserUrl = new URL("./queries/update.sql", import.meta.url);
const updateUserQuery = readFileSync(updateUserUrl, "utf8");

export function createUsersTable() {
  database.exec(createUsersTableQuery);
}

export function findUserByEmail(email) {
  const statement = database.prepare(findUserByEmailQuery);

  return statement.get({ email });
}

export function findUserById(id) {
  const statement = database.prepare(findUserByIdQuery);

  return statement.get({ id });
}

export function listUserRows() {
  const statement = database.prepare(listUsersQuery);

  return statement.all();
}

export function deleteUserRow(id) {
  const statement = database.prepare(deleteUserQuery);

  statement.run({ id });
}

export function updateUserRow(id, name, email) {
  // updated_at is written by the SQL statement, not by this function.
  const statement = database.prepare(updateUserQuery);

  statement.run({ id, name, email });

  return findUserById(id);
}

export function insertUser(name, email) {
  // created_at and updated_at are written by the SQL statement.
  // They are not parameters, so a caller cannot choose those dates.
  const statement = database.prepare(insertUserQuery);
  const result = statement.run({ name, email });

  return findUserById(result.lastInsertRowid);
}

createUsersTable();
