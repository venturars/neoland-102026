import { CREATE_TABLE_USERS } from "./queries/create-table-users.js";
import { CREATE_USER } from "./queries/create-user.js";
import { DELETE_USER } from "./queries/delete-user.js";
import { FIND_USER_BY_EMAIL } from "./queries/find-user-by-email.js";
import { FIND_USER_BY_ID } from "./queries/find-user-by-id.js";
import { FIND_USER_BY_NAME } from "./queries/find-user-by-name.js";
import { LIST_USERS } from "./queries/list-users.js";
import { UPDATE_USER } from "./queries/update-user.js";

const ORIGIN = "http://127.0.0.1:3000";

async function execute(method, sql, params) {
  const response = await fetch(`${ORIGIN}/execute`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ method, sql, params }),
  });
  const body = await response.json();

  if (!response.ok) {
    throw new Error(body.message);
  }

  return body;
}

export async function createTableUsers() {
  await execute("exec", CREATE_TABLE_USERS, []);
}

export async function createUser(name, email) {
  await createTableUsers();
  const body = await execute("run", CREATE_USER, [name, email]);

  return {
    id: Number(body.lastInsertRowid),
    name,
    email,
  };
}

export async function updateUser(id, name, email) {
  await createTableUsers();
  const body = await execute("run", UPDATE_USER, [name, email, id]);

  return body.changes;
}

export async function deleteUser(id) {
  await createTableUsers();
  const body = await execute("run", DELETE_USER, [id]);

  return body.changes;
}

export async function listUsers() {
  await createTableUsers();
  const body = await execute("all", LIST_USERS, []);

  return body.rows.map((user) => ({
    id: Number(user.id),
    name: user.name,
    email: user.email,
  }));
}

export async function findUserById(id) {
  await createTableUsers();
  const body = await execute("get", FIND_USER_BY_ID, [id]);

  if (body.row === null) {
    return undefined;
  }

  return {
    id: Number(body.row.id),
    name: body.row.name,
    email: body.row.email,
  };
}

export async function findUserByEmail(email) {
  await createTableUsers();
  const body = await execute("get", FIND_USER_BY_EMAIL, [email]);

  if (body.row === null) {
    return undefined;
  }

  return {
    id: Number(body.row.id),
    name: body.row.name,
    email: body.row.email,
  };
}

export async function findUserByName(name) {
  await createTableUsers();
  const body = await execute("all", FIND_USER_BY_NAME, [name]);

  return body.rows.map((user) => ({
    id: Number(user.id),
    name: user.name,
    email: user.email,
  }));
}
