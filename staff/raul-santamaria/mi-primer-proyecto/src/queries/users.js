import { CREATE_USERS_TABLE } from "./queries/create-users-table.js";
import { DELETE_USER } from "./queries/delete-user.js";
import { FIND_USER_BY_EMAIL } from "./queries/find-user-by-email.js";
import { FIND_USER_BY_ID } from "./queries/find-user-by-id.js";
import { INSERT_USER } from "./queries/insert-user.js";
import { LIST_USERS } from "./queries/list-users.js";
import { UPDATE_USER } from "./queries/update-user.js";

const ORIGIN = "http://127.0.0.1:3000";

function mapRow(row) {
  if (!row) {
    return undefined;
  }

  return {
    id: row.id,
    name: row.name,
    email: row.email,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

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

export async function findByEmail(email) {
  const body = await execute("get", FIND_USER_BY_EMAIL, { email });
  return mapRow(body.row);
}

export async function findById(id) {
  const body = await execute("get", FIND_USER_BY_ID, { id });
  return mapRow(body.row);
}

export async function insert(input) {
  const now = new Date();
  const isoString = now.toISOString();
  const createdAt = isoString.slice(0, 10);
  const body = await execute("get", INSERT_USER, {
    name: input.name,
    email: input.email,
    createdAt,
    updatedAt: createdAt,
  });
  return mapRow(body.row);
}

export async function list() {
  const body = await execute("all", LIST_USERS, {});
  const rows = body.rows;
  const result = [];

  for (const row of rows) {
    result.push(mapRow(row));
  }

  return result;
}

export async function update(input) {
  const now = new Date();
  const isoString = now.toISOString();
  const updatedAt = isoString.slice(0, 10);
  const body = await execute("get", UPDATE_USER, {
    id: input.id,
    name: input.name,
    email: input.email,
    updatedAt,
  });
  return mapRow(body.row);
}

export async function remove(id) {
  await execute("run", DELETE_USER, { id });
}
