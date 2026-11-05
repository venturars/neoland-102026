import { CREATE_USERS_TABLE } from "./queries/create-users-table.js";
import { FIND_ALL } from "./queries/find-all.js";
import { FIND_BY_EMAIL } from "./queries/find-by-email.js";
import { FIND_BY_ID } from "./queries/find-by-id.js";
import { FIND_BY_NAME } from "./queries/find-by-name.js";
import { INSERT_USER } from "./queries/insert.js";
import { REMOVE_USER } from "./queries/remove.js";
import { UPDATE_USER } from "./queries/update.js";

const ORIGIN = "http://127.0.0.1:3000";

// Envía una frase al servidor. Si no responde bien, logic traduce el fallo.
async function execute(method, sql, params) {
  const response = await fetch(`${ORIGIN}/execute`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ method, sql, params }),
  });

  if (!response.ok) {
    throw new Error(`Query failed with status ${response.status}`);
  }

  return response.json();
}

export async function createUsersTable() {
  await execute("exec", CREATE_USERS_TABLE, {});
}

export async function findAll() {
  const respuesta = await execute("all", FIND_ALL, {});
  return respuesta.rows;
}

export async function findById(id) {
  const respuesta = await execute("get", FIND_BY_ID, { id: Number(id) });
  return respuesta.row;
}

export async function findByEmail(email) {
  const respuesta = await execute("get", FIND_BY_EMAIL, { email });
  return respuesta.row;
}

export async function findByName(name) {
  const respuesta = await execute("all", FIND_BY_NAME, { name });
  return respuesta.rows;
}

export async function insert({ name, email }) {
  const respuesta = await execute("get", INSERT_USER, { name, email });
  return respuesta.row;
}

export async function update({ id, name, email }) {
  const respuesta = await execute("get", UPDATE_USER, {
    id: Number(id),
    name,
    email,
  });
  return respuesta.row;
}

export async function remove(id) {
  const respuesta = await execute("run", REMOVE_USER, { id: Number(id) });
  return respuesta.changes;
}
