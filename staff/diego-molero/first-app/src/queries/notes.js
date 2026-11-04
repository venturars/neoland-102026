import { readFileSync } from "node:fs";
import { db } from "../db/connection.js";

// Cada consulta conserva el usuario indicado, también al actualizar o borrar.
const createTableSql = readFileSync(
  new URL("./queries/notes/create-table.sql", import.meta.url),
  "utf8",
);
const findAllSql = readFileSync(
  new URL("./queries/notes/find-all.sql", import.meta.url),
  "utf8",
);
const findByIdSql = readFileSync(
  new URL("./queries/notes/find-by-id.sql", import.meta.url),
  "utf8",
);
const insertSql = readFileSync(
  new URL("./queries/notes/insert.sql", import.meta.url),
  "utf8",
);
const updateSql = readFileSync(
  new URL("./queries/notes/update.sql", import.meta.url),
  "utf8",
);
const removeSql = readFileSync(
  new URL("./queries/notes/remove.sql", import.meta.url),
  "utf8",
);

export function createNotesTable() {
  db.exec(createTableSql);
}

export function findAll(userId) {
  const rows = db.prepare(findAllSql).all({ userId });
  return rows.map((row) => ({ ...row }));
}

export function findById(userId, id) {
  const row = db.prepare(findByIdSql).get({ userId, id });
  return row ? { ...row } : undefined;
}

export function insert({ userId, title, content }) {
  const row = db.prepare(insertSql).get({ userId, title, content });
  return { ...row };
}

export function update({ userId, id, title, content }) {
  const row = db.prepare(updateSql).get({ userId, id, title, content });
  return row ? { ...row } : undefined;
}

export function remove(userId, id) {
  const result = db.prepare(removeSql).run({ userId, id });
  return result.changes > 0;
}
