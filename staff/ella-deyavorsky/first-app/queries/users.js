import { readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { db } from "../db/connection.js";

const currentFile = fileURLToPath(import.meta.url);
const currentFolder = path.dirname(currentFile);
const queriesFolder = path.join(currentFolder, "queries");

// The SQL stays in .sql files. This file only reads them and runs them.
const createUsersTablePath = path.join(queriesFolder, "create-users-table.sql");
const createUsersTableSql = readFileSync(createUsersTablePath, "utf8");
const insertPath = path.join(queriesFolder, "insert.sql");
const insertSql = readFileSync(insertPath, "utf8");
const findByIdPath = path.join(queriesFolder, "find-by-id.sql");
const findByIdSql = readFileSync(findByIdPath, "utf8");
const findByEmailPath = path.join(queriesFolder, "find-by-email.sql");
const findByEmailSql = readFileSync(findByEmailPath, "utf8");
const findAllPath = path.join(queriesFolder, "find-all.sql");
const findAllSql = readFileSync(findAllPath, "utf8");
const updatePath = path.join(queriesFolder, "update.sql");
const updateSql = readFileSync(updatePath, "utf8");
const removePath = path.join(queriesFolder, "remove.sql");
const removeSql = readFileSync(removePath, "utf8");

export function createUsersTable() {
  db.exec(createUsersTableSql);
}

export function insert(input) {
  const statement = db.prepare(insertSql);
  return statement.get({
    name: input.name,
    email: input.email,
  });
}

export function findById(id) {
  const statement = db.prepare(findByIdSql);
  return statement.get({ id });
}

export function findByEmail(email) {
  const statement = db.prepare(findByEmailSql);
  return statement.get({ email });
}

export function findAll() {
  const statement = db.prepare(findAllSql);
  return statement.all();
}

export function update(input) {
  const statement = db.prepare(updateSql);
  return statement.get({
    id: input.id,
    name: input.name,
    email: input.email,
  });
}

export function remove(id) {
  const statement = db.prepare(removeSql);
  statement.run({ id });
}
