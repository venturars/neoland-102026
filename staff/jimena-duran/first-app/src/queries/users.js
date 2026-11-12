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
  const payload = { method, sql, params };
  const body = JSON.stringify(payload);
  const url = ORIGIN + "/execute";
  const response = await fetch(url, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body,
  });
  if (!response.ok) {
    throw new Error("Query failed");
  }
  const result = await response.json();
  return result;
}

export async function createUsersTable() {
  await execute("exec", CREATE_USERS_TABLE, {});
}

export async function findById(id) {
  const result = await execute("get", FIND_BY_ID, { id });
  return result.row;
}

export async function findByEmail(email) {
  const result = await execute("get", FIND_BY_EMAIL, { email });
  return result.row;
}

export async function findByName(name) {
  const result = await execute("all", FIND_BY_NAME, { name });
  return result.rows;
}

export async function insert({ name, email }) {
  const result = await execute("get", INSERT_USER, { name, email });
  return result.row;
}

export async function update({ id, name, email }) {
  const result = await execute("get", UPDATE_USER, { id, name, email });
  return result.row;
}

export async function remove(id) {
  const result = await execute("run", REMOVE_USER, { id });
  return result;
}

export async function findAll() {
  const result = await execute("all", FIND_ALL, {});
  return result.rows;
}

export async function listTables() {
  const result = await execute("all", LIST_TABLES, {});
  return result.rows;
}
