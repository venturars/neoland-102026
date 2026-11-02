import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { db } from "../db/connection.js";

const fileUrl = import.meta.url;
const filePath = fileURLToPath(fileUrl);
const fileDirectory = dirname(filePath);
const directory = join(fileDirectory, "queries");

const createUsersTablePath = join(directory, "create-users-table.sql");
const createUsersTableSql = readFileSync(createUsersTablePath, "utf8");

const findUserByIdPath = join(directory, "find-by-id.sql");
const findUserByIdSql = readFileSync(findUserByIdPath, "utf8");

const findUserByEmailPath = join(directory, "find-by-email.sql");
const findUserByEmailSql = readFileSync(findUserByEmailPath, "utf8");

const insertUserPath = join(directory, "insert.sql");
const insertUserSql = readFileSync(insertUserPath, "utf8");

const updateUserPath = join(directory, "update.sql");
const updateUserSql = readFileSync(updateUserPath, "utf8");

const deleteUserPath = join(directory, "remove.sql");
const deleteUserSql = readFileSync(deleteUserPath, "utf8");

const listUsersPath = join(directory, "find-all.sql");
const listUsersSql = readFileSync(listUsersPath, "utf8");

export function createUsersTable() {
  db.exec(createUsersTableSql);
}

export function findUserById(id) {
  const statement = db.prepare(findUserByIdSql);
  return statement.get({ id });
}

export function findUserByEmail(email) {
  const statement = db.prepare(findUserByEmailSql);
  return statement.get({ email });
}

export function insertUser(name, email) {
  const statement = db.prepare(insertUserSql);
  return statement.get({ name, email });
}

export function updateUser(id, name, email) {
  const statement = db.prepare(updateUserSql);
  return statement.get({ id, name, email });
}

export function deleteUser(id) {
  const statement = db.prepare(deleteUserSql);
  return statement.run({ id });
}

export function listUsers() {
  const statement = db.prepare(listUsersSql);
  return statement.all();
}
