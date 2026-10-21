import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { database } from "../db/connection.js";

const queriesFolder = path.join(path.dirname(fileURLToPath(import.meta.url)), "queries");

function readQuery(fileName) {
  return fs.readFileSync(path.join(queriesFolder, fileName), "utf8");
}

const createUserSql = readQuery("create-user.sql");
const updateUserSql = readQuery("update-user.sql");
const deleteUserSql = readQuery("delete-user.sql");
const listUsersSql = readQuery("list-users.sql");

export function insertUser(name, email) {
  const result = database.prepare(createUserSql).run(name, email);

  return {
    id: Number(result.lastInsertRowid),
    name,
    email,
  };
}

export function saveUser(id, name, email) {
  return database.prepare(updateUserSql).run(name, email, id).changes;
}

export function removeUser(id) {
  return database.prepare(deleteUserSql).run(id).changes;
}

export function selectUsers() {
  return database.prepare(listUsersSql).all().map((user) => ({
    id: Number(user.id),
    name: user.name,
    email: user.email,
  }));
}
