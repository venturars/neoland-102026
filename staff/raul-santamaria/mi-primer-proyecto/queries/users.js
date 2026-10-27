import { readFileSync } from "node:fs";
import { db } from "../db/connection.js";

function readSql(fileName) {
  return readFileSync(
    new URL(`./queries/${fileName}`, import.meta.url),
    "utf8",
  );
}

const createTableSql = readSql("create-users-table.sql");
const findByEmailSql = readSql("find-user-by-email.sql");
const findByIdSql = readSql("find-user-by-id.sql");
const insertSql = readSql("insert-user.sql");
const listSql = readSql("list-users.sql");
const updateSql = readSql("update-user.sql");
const deleteSql = readSql("delete-user.sql");

db.exec(createTableSql);

const findByEmailStatement = db.prepare(findByEmailSql);
const findByIdStatement = db.prepare(findByIdSql);
const insertStatement = db.prepare(insertSql);
const listStatement = db.prepare(listSql);
const updateStatement = db.prepare(updateSql);
const deleteStatement = db.prepare(deleteSql);

function today() {
  return new Date().toISOString().slice(0, 10);
}

function toUser(row) {
  return {
    id: row.id,
    name: row.name,
    email: row.email,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export function findByEmail(email) {
  const row = findByEmailStatement.get(email);

  if (!row) {
    return undefined;
  }

  return toUser(row);
}

export function findById(id) {
  const row = findByIdStatement.get(id);

  if (!row) {
    return undefined;
  }

  return toUser(row);
}

export function insert(input) {
  const createdAt = today();
  const result = insertStatement.run(
    input.name,
    input.email,
    createdAt,
    createdAt,
  );

  return {
    id: Number(result.lastInsertRowid),
    name: input.name,
    email: input.email,
    createdAt,
    updatedAt: createdAt,
  };
}

export function list() {
  const rows = listStatement.all();
  const result = [];

  for (const row of rows) {
    result.push(toUser(row));
  }

  return result;
}

export function update(input) {
  const updatedAt = today();

  updateStatement.run(input.name, input.email, updatedAt, input.id);

  const row = findByIdStatement.get(input.id);
  return toUser(row);
}

export function remove(id) {
  deleteStatement.run(id);
}
