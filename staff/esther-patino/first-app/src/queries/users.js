/* global fetch */
import { CREATE_USERS_TABLE } from "./queries/create-users-table.js";
import { FIND_ALL } from "./queries/find-all.js";
import { FIND_BY_EMAIL } from "./queries/find-by-email.js";
import { FIND_BY_ID } from "./queries/find-by-id.js";
import { FIND_BY_NAME } from "./queries/find-by-name.js";
import { INSERT_USER } from "./queries/insert.js";
import { LIST_TABLES } from "./queries/list-tables.js";
import { REMOVE_USER } from "./queries/remove.js";
import { UPDATE_USER } from "./queries/update.js";

const ORIGIN = "http://127.0.0.1:3000";

async function execute(method, sql, params) {
  const url = `${ORIGIN}/execute`;
  const payload = JSON.stringify({ method, sql, params });
  const response = await fetch(url, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: payload,
  });
  if (!response.ok) {
    throw new Error("Query failed");
  }
  const body = await response.json();
  return body;
}

export async function createUsersTable() {
  await execute("exec", CREATE_USERS_TABLE, {});
}

export async function findById(id) {
  const body = await execute("get", FIND_BY_ID, { id });
  const row = body.row;
  return row;
}

export async function findByEmail(email) {
  const body = await execute("get", FIND_BY_EMAIL, { email });
  const row = body.row;
  return row;
}

export async function findByName(name) {
  const body = await execute("all", FIND_BY_NAME, { name });
  const rows = body.rows;
  return rows;
}

export async function insertUser({ name, email }) {
  const body = await execute("get", INSERT_USER, { name, email });
  const row = body.row;
  return row;
}

export async function updateUser({ id, name, email }) {
  const body = await execute("get", UPDATE_USER, { id, name, email });
  const row = body.row;
  return row;
}

export async function removeUser(id) {
  const body = await execute("run", REMOVE_USER, { id });
  return body;
}

export async function findAll() {
  const body = await execute("all", FIND_ALL, {});
  const rows = body.rows;
  return rows;
}

export async function listTables() {
  const body = await execute("all", LIST_TABLES, {});
  const rows = body.rows;
  return rows;
}
