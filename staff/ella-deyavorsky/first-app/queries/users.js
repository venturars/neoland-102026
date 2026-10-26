import { readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { db } from "../db/connection.js";

const queriesFolder = path.join(
  path.dirname(fileURLToPath(import.meta.url)),
  "queries",
);

// The SQL stays in .sql files. This file only reads them and runs them.
const createUsersTableSql = readFileSync(
  path.join(queriesFolder, "create-users-table.sql"),
  "utf8",
);
const insertSql = readFileSync(path.join(queriesFolder, "insert.sql"), "utf8");
const findByIdSql = readFileSync(
  path.join(queriesFolder, "find-by-id.sql"),
  "utf8",
);
const findByEmailSql = readFileSync(
  path.join(queriesFolder, "find-by-email.sql"),
  "utf8",
);
const findAllSql = readFileSync(
  path.join(queriesFolder, "find-all.sql"),
  "utf8",
);
const updateSql = readFileSync(path.join(queriesFolder, "update.sql"), "utf8");
const removeSql = readFileSync(path.join(queriesFolder, "remove.sql"), "utf8");

export function createUsersTable() {
  db.exec(createUsersTableSql);
}

export function insert(input) {
  return db.prepare(insertSql).get({
    name: input.name,
    email: input.email,
  });
}

export function findById(id) {
  return db.prepare(findByIdSql).get({ id });
}

export function findByEmail(email) {
  return db.prepare(findByEmailSql).get({ email });
}

export function findAll() {
  return db.prepare(findAllSql).all();
}

export function update(input) {
  return db.prepare(updateSql).get({
    id: input.id,
    name: input.name,
    email: input.email,
  });
}

export function remove(id) {
  db.prepare(removeSql).run({ id });
}
