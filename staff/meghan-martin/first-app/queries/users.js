import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { db } from "../db/connection.js";

const fileUrl = import.meta.url;
const filePath = fileURLToPath(fileUrl);
const directory = dirname(filePath);

const createUsersTablePath = join(
  directory,
  "queries",
  "create-users-table.sql",
);
const createUsersTableSql = readFileSync(createUsersTablePath, "utf8");
const findByIdPath = join(directory, "queries", "find-by-id.sql");
const findByIdSql = readFileSync(findByIdPath, "utf8");
const findByEmailPath = join(directory, "queries", "find-by-email.sql");
const findByEmailSql = readFileSync(findByEmailPath, "utf8");
const insertPath = join(directory, "queries", "insert.sql");
const insertSql = readFileSync(insertPath, "utf8");
const updatePath = join(directory, "queries", "update.sql");
const updateSql = readFileSync(updatePath, "utf8");
const removePath = join(directory, "queries", "remove.sql");
const removeSql = readFileSync(removePath, "utf8");
const findAllPath = join(directory, "queries", "find-all.sql");
const findAllSql = readFileSync(findAllPath, "utf8");

export function createUsersTable() {
  db.exec(createUsersTableSql);
}

export function findById(id) {
  const statement = db.prepare(findByIdSql);
  return statement.get({ id });
}

export function findByEmail(email) {
  const statement = db.prepare(findByEmailSql);
  return statement.get({ email });
}

export function insert({ name, email }) {
  const statement = db.prepare(insertSql);
  return statement.get({ name, email });
}

export function update({ id, name, email }) {
  const statement = db.prepare(updateSql);
  return statement.get({ id, name, email });
}

export function remove(id) {
  const statement = db.prepare(removeSql);
  return statement.run({ id });
}

export function findAll() {
  const statement = db.prepare(findAllSql);
  return statement.all();
}
