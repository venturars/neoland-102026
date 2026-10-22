import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { database } from "../DB/connection.js";

const queriesFolder = path.join(path.dirname(fileURLToPath(import.meta.url)), "queries");

function readQuery(fileName) {
  return fs.readFileSync(path.join(queriesFolder, fileName), "utf8");
}

const createTableUsersSql = readQuery("create-table-users.sql");
const createUserSql = readQuery("create-user.sql");
const updateUserSql = readQuery("update-user.sql");
const deleteUserSql = readQuery("delete-user.sql");
const listUsersSql = readQuery("list-users.sql");
const findUserByIdSql = readQuery("find-user-by-id.sql");
const findUserByEmailSql = readQuery("find-user-by-email.sql");

export function createTableUsers() {
  database.exec(createTableUsersSql);
}

createTableUsers();

export function createUser(name, email) {
  const result = database.prepare(createUserSql).run(name, email);

  return {
    id: Number(result.lastInsertRowid),
    name,
    email,
  };
}

export function updateUser(id, name, email) {
  return database.prepare(updateUserSql).run(name, email, id).changes;
}

export function deleteUser(id) {
  return database.prepare(deleteUserSql).run(id).changes;
}

export function listUsers() {
  return database.prepare(listUsersSql).all().map((user) => ({
    id: Number(user.id),
    name: user.name,
    email: user.email,
  }));
}

export function findUserById(id) {
  const user = database.prepare(findUserByIdSql).get(id);

  if (!user) {
    return undefined;
  }

  return {
    id: Number(user.id),
    name: user.name,
    email: user.email,
  };
}

export function findUserByEmail(email) {
  const user = database.prepare(findUserByEmailSql).get(email);

  if (!user) {
    return undefined;
  }

  return {
    id: Number(user.id),
    name: user.name,
    email: user.email,
  };
}
