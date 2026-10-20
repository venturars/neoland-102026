import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { db } from "../db/connection.js";

const directory = dirname(fileURLToPath(import.meta.url));

const createUsersTableSql = readFileSync(
  join(directory, "queries", "create-users-table.sql"),
  "utf8",
);
const findByIdSql = readFileSync(
  join(directory, "queries", "find-by-id.sql"),
  "utf8",
);
const findByEmailSql = readFileSync(
  join(directory, "queries", "find-by-email.sql"),
  "utf8",
);
const insertSql = readFileSync(
  join(directory, "queries", "insert.sql"),
  "utf8",
);
const updateSql = readFileSync(
  join(directory, "queries", "update.sql"),
  "utf8",
);
const removeSql = readFileSync(
  join(directory, "queries", "remove.sql"),
  "utf8",
);
const findAllSql = readFileSync(
  join(directory, "queries", "find-all.sql"),
  "utf8",
);

export function createUsersTable() {
  db.exec(createUsersTableSql);
}

export function findById(id) {
  return db.prepare(findByIdSql).get({ id });
}

export function findByEmail(email) {
  return db.prepare(findByEmailSql).get({ email });
}

export function insert({ name, email }) {
  return db.prepare(insertSql).get({ name, email });
}

export function update({ id, name, email }) {
  return db.prepare(updateSql).get({ id, name, email });
}

export function remove(id) {
  return db.prepare(removeSql).run({ id });
}

export function findAll() {
  return db.prepare(findAllSql).all();
}
