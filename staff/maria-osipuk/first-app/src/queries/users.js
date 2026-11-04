import { CREATE_USERS_TABLE } from "./queries/create-users-table.js";
import { DELETE_USER } from "./queries/delete.js";
import { FIND_USER_BY_EMAIL } from "./queries/find-by-email.js";
import { FIND_USER_BY_ID } from "./queries/find-by-id.js";
import { INSERT_USER } from "./queries/insert.js";
import { LIST_USERS } from "./queries/list.js";
import { UPDATE_USER } from "./queries/update.js";

// This module does not open SQLite. It sends each SQL text to the data
// server (src/db/server.js), so it only needs import and fetch. Both
// exist in Node and in the browser, and that is why the web can use it.
const DATABASE_SERVER = "http://127.0.0.1:3000";

// The only wrapper around fetch. method says what SQLite should do:
// exec runs SQL, get reads one row, all reads rows and run writes.
async function execute(method, sql, params) {
  const url = DATABASE_SERVER + "/execute";
  const payload = JSON.stringify({ method, sql, params });
  const response = await fetch(url, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: payload,
  });

  // The server answers 500 without details. logic/ replaces this error
  // with its own message, so a client never sees what SQLite said.
  if (!response.ok) {
    throw new Error("Query failed");
  }

  const body = await response.json();

  return body;
}

export async function createUsersTable() {
  await execute("exec", CREATE_USERS_TABLE, {});
}

export async function findUserByEmail(email) {
  const body = await execute("get", FIND_USER_BY_EMAIL, { email });

  // A missing row arrives as null. logic/ checks it with if (!user).
  return body.row;
}

export async function findUserById(id) {
  const body = await execute("get", FIND_USER_BY_ID, { id });

  return body.row;
}

export async function listUserRows() {
  const body = await execute("all", LIST_USERS, {});

  return body.rows;
}

export async function deleteUserRow(id) {
  await execute("run", DELETE_USER, { id });
}

export async function updateUserRow(id, name, email) {
  // updated_at is written by the SQL statement, not by this function.
  await execute("run", UPDATE_USER, { id, name, email });

  return findUserById(id);
}

export async function insertUser(name, email) {
  // created_at and updated_at are written by the SQL statement.
  // They are not parameters, so a caller cannot choose those dates.
  const body = await execute("run", INSERT_USER, { name, email });

  return findUserById(body.lastInsertRowid);
}
