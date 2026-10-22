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
  return database.prepare(CREATE_USERS_TABLE_SQL).run();
}

export function insert(user) {
  return db.prepare(INSERT_SQL).get({
    name: user.name,
    email: user.email,
  });
}

export function findById(id) {
  return db.prepare(FIND_BY_ID_SQL).get({ id });
}

export function findByEmail(email) {
  return db.prepare(FIND_BY_EMAIL_SQL).get({ email });
}

export function findByName(name) {
  return db.prepare(FIND_BY_NAME_SQL).all({ name });
}

export function findAll() {
  return db.prepare(FIND_ALL_SQL).all();
}

export function update(user) {
  return db.prepare(UPDATE_SQL).get({
    name: user.name,
    email: user.email,
    id: user.id,
  });
}

export function remove(id) {
  return db.prepare(REMOVE_SQL).run({ id });
}
