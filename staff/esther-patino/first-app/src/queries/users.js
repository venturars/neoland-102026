import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { db } from "../db/connection.js";

const QUERIES_FILE = fileURLToPath(import.meta.url);
const QUERIES_DIRECTORY = dirname(QUERIES_FILE);

export function findById(id) {
  const sqlPath = join(QUERIES_DIRECTORY, "queries", "find-by-id.sql");
  const sql = readFileSync(sqlPath, "utf8");
  const statement = db.prepare(sql);
  return statement.get({ id });
}

export function findByEmail(email) {
  const sqlPath = join(QUERIES_DIRECTORY, "queries", "find-by-email.sql");
  const sql = readFileSync(sqlPath, "utf8");
  const statement = db.prepare(sql);
  return statement.get({ email });
}

export function findByName(name) {
  const sqlPath = join(QUERIES_DIRECTORY, "queries", "find-by-name.sql");
  const sql = readFileSync(sqlPath, "utf8");
  const statement = db.prepare(sql);
  return statement.all({ name });
}

export function insertUser({ name, email }) {
  const sqlPath = join(QUERIES_DIRECTORY, "queries", "insert-user.sql");
  const sql = readFileSync(sqlPath, "utf8");
  const statement = db.prepare(sql);
  return statement.get({ name, email });
}

export function updateUser({ id, name, email }) {
  const sqlPath = join(QUERIES_DIRECTORY, "queries", "update-user.sql");
  const sql = readFileSync(sqlPath, "utf8");
  const statement = db.prepare(sql);
  return statement.get({ id, name, email });
}

export function removeUser(id) {
  const sqlPath = join(QUERIES_DIRECTORY, "queries", "remove-user.sql");
  const sql = readFileSync(sqlPath, "utf8");
  const statement = db.prepare(sql);
  return statement.run({ id });
}

export function findAll() {
  const sqlPath = join(QUERIES_DIRECTORY, "queries", "find-all.sql");
  const sql = readFileSync(sqlPath, "utf8");
  const statement = db.prepare(sql);
  return statement.all();
}
