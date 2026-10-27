import { readFileSync } from "node:fs";
import { db } from "../db/connections.js";

const CREATE_USERS_TABLE_SQL = readFileSync(
  new URL("./queries/create-users-table.sql", import.meta.url),
  "utf8",
);

const INSERT_SQL = readFileSync(
  new URL("./queries/insert.sql", import.meta.url),
  "utf8",
);

const FIND_BY_ID_SQL = readFileSync(
  new URL("./queries/find-by-id.sql", import.meta.url),
  "utf8",
);

const FIND_BY_EMAIL_SQL = readFileSync(
  new URL("./queries/find-by-email.sql", import.meta.url),
  "utf8",
);

const FIND_BY_NAME_SQL = readFileSync(
  new URL("./queries/find-by-name.sql", import.meta.url),
  "utf8",
);

const FIND_ALL_SQL = readFileSync(
  new URL("./queries/find-all.sql", import.meta.url),
  "utf8",
);

const UPDATE_SQL = readFileSync(
  new URL("./queries/update.sql", import.meta.url),
  "utf8",
);

const REMOVE_SQL = readFileSync(
  new URL("./queries/remove.sql", import.meta.url),
  "utf8",
);

export function createUsersTable(database) {
  const statement = database.prepare(CREATE_USERS_TABLE_SQL);

  return statement.run();
}

export function insert(user) {
  const statement = db.prepare(INSERT_SQL);

  return statement.get({
    name: user.name,
    email: user.email,
  });
}

export function findById(id) {
  const statement = db.prepare(FIND_BY_ID_SQL);

  return statement.get({ id });
}

export function findByEmail(email) {
  const statement = db.prepare(FIND_BY_EMAIL_SQL);

  return statement.get({ email });
}

export function findByName(name) {
  const statement = db.prepare(FIND_BY_NAME_SQL);

  return statement.all({ name });
}

export function findAll() {
  const statement = db.prepare(FIND_ALL_SQL);

  return statement.all();
}

export function update(user) {
  const statement = db.prepare(UPDATE_SQL);

  return statement.get({
    name: user.name,
    email: user.email,
    id: user.id,
  });
}

export function remove(id) {
  const statement = db.prepare(REMOVE_SQL);

  return statement.run({ id });
}
