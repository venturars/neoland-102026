import { readFileSync } from "node:fs";
import { join } from "node:path";
import { db } from "../db/connection.js";

const directory = join(import.meta.dirname, "queries");

const createUsersTableSql = readFileSync(
  join(directory, "create-users-table.sql"),
  "utf8",
);

const findUserByIdSql = readFileSync(join(directory, "find-by-id.sql"), "utf8");

const findUserByEmailSql = readFileSync(
  join(directory, "find-by-email.sql"),
  "utf8",
);

const insertUserSql = readFileSync(join(directory, "insert.sql"), "utf8");

const updateUserSql = readFileSync(join(directory, "update.sql"), "utf8");

const deleteUserSql = readFileSync(join(directory, "remove.sql"), "utf8");

const listUsersSql = readFileSync(join(directory, "find-all.sql"), "utf8");

export function createUsersTable() {
  db.exec(createUsersTableSql);
}

export function findUserById(id) {
  return db.prepare(findUserByIdSql).get({ id });
}

export function findUserByEmail(email) {
  return db.prepare(findUserByEmailSql).get({ email });
}

export function insertUser(name, email) {
  return db.prepare(insertUserSql).get({ name, email });
}

export function updateUser(id, name, email) {
  return db.prepare(updateUserSql).get({ id, name, email });
}

export function deleteUser(id) {
  return db.prepare(deleteUserSql).run({ id });
}

export function listUsers() {
  return db.prepare(listUsersSql).all();
}
