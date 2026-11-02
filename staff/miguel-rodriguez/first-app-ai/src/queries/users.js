import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { db } from "../db/connection.js";

const modulePath = fileURLToPath(import.meta.url);
const directory = dirname(modulePath);

const createUsersTablePath = join(
  directory,
  "queries",
  "create-users-table.sql",
);
const createUsersTableSql = readFileSync(createUsersTablePath, "utf8");
const findByEmailPath = join(directory, "queries", "find-by-email.sql");
const findByEmailSql = readFileSync(findByEmailPath, "utf8");
const findByNamePath = join(directory, "queries", "find-by-name.sql");
const findByNameSql = readFileSync(findByNamePath, "utf8");
const insertPath = join(directory, "queries", "insert.sql");
const insertSql = readFileSync(insertPath, "utf8");
const findAllPath = join(directory, "queries", "find-all.sql");
const findAllSql = readFileSync(findAllPath, "utf8");
const findByIdPath = join(directory, "queries", "find-by-id.sql");
const findByIdSql = readFileSync(findByIdPath, "utf8");
const updatePath = join(directory, "queries", "update.sql");
const updateSql = readFileSync(updatePath, "utf8");
const removePath = join(directory, "queries", "remove.sql");
const removeSql = readFileSync(removePath, "utf8");

export function createUsersTable() {
  db.exec(createUsersTableSql);
}

export function findByEmail(email) {
  const statement = db.prepare(findByEmailSql);
  const user = statement.get({ email });
  return user;
}

export function insert({ name, email }) {
  const statement = db.prepare(insertSql);
  const createdUser = statement.get({ name, email });
  return createdUser;
}

export function findAll() {
  const statement = db.prepare(findAllSql);
  const users = statement.all();
  return users;
}

export function findById(id) {
  const statement = db.prepare(findByIdSql);
  const user = statement.get({ id });
  return user;
}

export function update({ id, name, email }) {
  const statement = db.prepare(updateSql);
  const updatedUser = statement.get({ id, name, email });
  return updatedUser;
}

export function remove(id) {
  const statement = db.prepare(removeSql);
  const deletionResult = statement.run({ id });
  return deletionResult;
}

export function findByName(name) {
  const statement = db.prepare(findByNameSql);
  const users = statement.all({ name });
  return users;
}
