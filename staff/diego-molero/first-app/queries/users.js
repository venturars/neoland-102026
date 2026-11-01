import { readFileSync } from "node:fs";
import { db } from "../db/connection.js";

// El SQL se carga una vez desde rutas relativas al módulo.
const createUsersTableUrl = new URL(
  "./queries/create-users-table.sql",
  import.meta.url,
);
const createUsersTableSql = readFileSync(createUsersTableUrl, "utf8");
const findByIdUrl = new URL("./queries/find-by-id.sql", import.meta.url);
const findByIdSql = readFileSync(findByIdUrl, "utf8");
const findByEmailUrl = new URL("./queries/find-by-email.sql", import.meta.url);
const findByEmailSql = readFileSync(findByEmailUrl, "utf8");
const findByNameUrl = new URL("./queries/find-by-name.sql", import.meta.url);
const findByNameSql = readFileSync(findByNameUrl, "utf8");
const findAllUrl = new URL("./queries/find-all.sql", import.meta.url);
const findAllSql = readFileSync(findAllUrl, "utf8");
const insertUrl = new URL("./queries/insert.sql", import.meta.url);
const insertSql = readFileSync(insertUrl, "utf8");
const updateUrl = new URL("./queries/update.sql", import.meta.url);
const updateSql = readFileSync(updateUrl, "utf8");
const removeUrl = new URL("./queries/remove.sql", import.meta.url);
const removeSql = readFileSync(removeUrl, "utf8");

export function createUsersTable() {
  db.exec(createUsersTableSql);
}

// Las consultas devuelven objetos normales y traducen el conflicto UNIQUE.
function toUser(row) {
  if (!row) {
    return undefined;
  }
  return { ...row };
}

function writeUser(sql, parameters) {
  try {
    const statement = db.prepare(sql);
    const row = statement.get(parameters);
    return toUser(row);
  } catch (error) {
    if (error.code === "ERR_SQLITE_ERROR" && error.errcode === 2067) {
      throw new Error("Email is already used", { cause: error });
    }
    throw error;
  }
}

export function findById(id) {
  const statement = db.prepare(findByIdSql);
  const row = statement.get({ id });
  return toUser(row);
}

export function findByEmail(email) {
  const statement = db.prepare(findByEmailSql);
  const row = statement.get({ email });
  return toUser(row);
}

export function findByName(name) {
  const statement = db.prepare(findByNameSql);
  const rows = statement.all({ name });
  return rows.map(toUser);
}

export function findAll() {
  const statement = db.prepare(findAllSql);
  const rows = statement.all();
  return rows.map(toUser);
}

export function insert({ name, email }) {
  return writeUser(insertSql, { name, email });
}

export function update({ id, name, email }) {
  return writeUser(updateSql, { id, name, email });
}

export function remove(id) {
  const statement = db.prepare(removeSql);
  const result = statement.run({ id });
  return result.changes > 0;
}
