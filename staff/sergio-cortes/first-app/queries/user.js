import { readFileSync } from "node:fs";

const CREATE_USERS_TABLE_SQL = readFileSync(
  new URL("./queries/create-users-table.sql", import.meta.url),
  "utf8",
);

const SELECT_USERS_SQL = readFileSync(
  new URL("./queries/select-users.sql", import.meta.url),
  "utf8",
);

const INSERT_USER_SQL = readFileSync(
  new URL("./queries/insert-user.sql", import.meta.url),
  "utf8",
);

const SELECT_USER_BY_ID_SQL = readFileSync(
  new URL("./queries/select-user-by-id.sql", import.meta.url),
  "utf8",
);

const UPDATE_USER_SQL = readFileSync(
  new URL("./queries/update-user.sql", import.meta.url),
  "utf8",
);

const DELETE_USER_SQL = readFileSync(
  new URL("./queries/delete-user.sql", import.meta.url),
  "utf8",
);

export function createUsersTable(database) {
  return database.prepare(CREATE_USERS_TABLE_SQL).run();
}

export function selectUsers(database) {
  return database.prepare(SELECT_USERS_SQL).all();
}

export function insertUser(database, user) {
  return database.prepare(INSERT_USER_SQL).run(user.name, user.email);
}

export function selectUserById(database, id) {
  return database.prepare(SELECT_USER_BY_ID_SQL).get(id);
}

export function updateUserById(database, user) {
  return database.prepare(UPDATE_USER_SQL).run(user.name, user.email, user.id);
}

export function deleteUserById(database, id) {
  return database.prepare(DELETE_USER_SQL).run(id);
}
