import { readFileSync } from "node:fs";

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

export function insert(database, user) {
  return database.prepare(INSERT_SQL).get({
    name: user.name,
    email: user.email,
  });
}

export function findById(database, id) {
  return database.prepare(FIND_BY_ID_SQL).get({ id });
}

export function findAll(database) {
  return database.prepare(FIND_ALL_SQL).all();
}

export function update(database, user) {
  return database.prepare(UPDATE_SQL).get({
    name: user.name,
    email: user.email,
    id: user.id,
  });
}

export function remove(database, id) {
  return database.prepare(REMOVE_SQL).run({ id });
}
