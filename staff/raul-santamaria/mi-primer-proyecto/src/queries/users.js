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
const createTableSql = readFileSync(createUsersTablePath, "utf8");
const findByEmailPath = join(directory, "queries", "find-user-by-email.sql");
const findByEmailSql = readFileSync(findByEmailPath, "utf8");
const findByIdPath = join(directory, "queries", "find-user-by-id.sql");
const findByIdSql = readFileSync(findByIdPath, "utf8");
const insertPath = join(directory, "queries", "insert-user.sql");
const insertSql = readFileSync(insertPath, "utf8");
const listPath = join(directory, "queries", "list-users.sql");
const listSql = readFileSync(listPath, "utf8");
const updatePath = join(directory, "queries", "update-user.sql");
const updateSql = readFileSync(updatePath, "utf8");
const deletePath = join(directory, "queries", "delete-user.sql");
const deleteSql = readFileSync(deletePath, "utf8");

db.exec(createTableSql);

export function findByEmail(email) {
  const statement = db.prepare(findByEmailSql);
  const row = statement.get(email);

  if (!row) {
    return undefined;
  }

  return {
    id: row.id,
    name: row.name,
    email: row.email,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export function findById(id) {
  const statement = db.prepare(findByIdSql);
  const row = statement.get(id);

  if (!row) {
    return undefined;
  }

  return {
    id: row.id,
    name: row.name,
    email: row.email,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export function insert(input) {
  const now = new Date();
  const isoString = now.toISOString();
  const createdAt = isoString.slice(0, 10);
  const statement = db.prepare(insertSql);
  const result = statement.run(input.name, input.email, createdAt, createdAt);
  const lastInsertRowid = result.lastInsertRowid;
  const id = Number(lastInsertRowid);

  return {
    id,
    name: input.name,
    email: input.email,
    createdAt,
    updatedAt: createdAt,
  };
}

export function list() {
  const statement = db.prepare(listSql);
  const rows = statement.all();
  const result = [];

  for (const row of rows) {
    const user = {
      id: row.id,
      name: row.name,
      email: row.email,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    };
    result.push(user);
  }

  return result;
}

export function update(input) {
  const now = new Date();
  const isoString = now.toISOString();
  const updatedAt = isoString.slice(0, 10);
  const statement = db.prepare(updateSql);
  statement.run(input.name, input.email, updatedAt, input.id);
  const findStatement = db.prepare(findByIdSql);
  const row = findStatement.get(input.id);

  return {
    id: row.id,
    name: row.name,
    email: row.email,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export function remove(id) {
  const statement = db.prepare(deleteSql);
  statement.run(id);
}
