import { readFileSync } from "node:fs";
import { db } from "../db/connection.js";

// El SQL se carga una vez desde rutas relativas al módulo, no a la terminal.
const createUsersTableSql = readFileSync(new URL("./queries/create-users-table.sql", import.meta.url), "utf8");
const findByIdSql = readFileSync(new URL("./queries/find-by-id.sql", import.meta.url), "utf8");
const findByEmailSql = readFileSync(new URL("./queries/find-by-email.sql", import.meta.url), "utf8");
const findAllSql = readFileSync(new URL("./queries/find-all.sql", import.meta.url), "utf8");
const insertSql = readFileSync(new URL("./queries/insert.sql", import.meta.url), "utf8");
const updateSql = readFileSync(new URL("./queries/update.sql", import.meta.url), "utf8");
const removeSql = readFileSync(new URL("./queries/remove.sql", import.meta.url), "utf8");

export function createUsersTable() {
  db.exec(createUsersTableSql);
}

// La capa de consultas devuelve objetos normales y traduce errores del motor.
function toUser(row) {
  return row ? { ...row } : undefined;
}

function writeUser(sql, parameters) {
  try {
    return toUser(db.prepare(sql).get(parameters));
  } catch (error) {
    if (error.code === "ERR_SQLITE_ERROR" && error.errcode === 2067) {
      throw new Error("Email is already used", { cause: error });
    }
    throw error;
  }
}

export function findById(id) {
  return toUser(db.prepare(findByIdSql).get({ id }));
}

export function findByEmail(email) {
  return toUser(db.prepare(findByEmailSql).get({ email }));
}

export function findAll() {
  return db.prepare(findAllSql).all().map(toUser);
}

export function insert({ name, email }) {
  return writeUser(insertSql, { name, email });
}

export function update({ id, name, email }) {
  return writeUser(updateSql, { id, name, email });
}

export function remove(id) {
  return db.prepare(removeSql).run({ id }).changes > 0;
}
