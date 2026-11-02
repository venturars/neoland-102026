import { deleteUser } from "../../logic/delete-user.js";
import { ValidationError } from "../../logic/errors.js";
import { findUserById } from "../../logic/find-user-by-id.js";
import { listUsers } from "../../logic/list-users.js";
import { updateUser } from "../../logic/update-user.js";
import { readJsonBody } from "./read-json-body.js";
import { sendJson } from "./send-json.js";

function parseUserId(rawId) {
  const hasOnlyDigits = /^[1-9][0-9]*$/.test(rawId);

  if (!hasOnlyDigits) {
    throw new ValidationError("Id is invalid");
  }

  const id = Number(rawId);

  if (!Number.isSafeInteger(id)) {
    throw new ValidationError("Id is invalid");
  }

  return id;
}

export async function handleUsers(request, response, pathname) {
  if (pathname === "/api/users") {
    if (request.method !== "GET") {
      response.setHeader("Allow", "GET");
      throw new Error("HTTP method is not allowed");
    }

    const users = listUsers();
    const selection = [];

    for (const user of users) {
      selection.push({
        id: user.id,
        name: user.name,
        email: user.email,
      });
    }

    sendJson(response, 200, selection);
    return;
  }

  const parts = pathname.split("/");

  if (parts.length !== 4) {
    throw new Error("HTTP resource does not exist");
  }

  const id = parseUserId(parts[3]);

  if (request.method === "GET") {
    const user = findUserById(id);
    sendJson(response, 200, {
      id: user.id,
      name: user.name,
      email: user.email,
    });
    return;
  }

  if (request.method === "PATCH") {
    const current = findUserById(id);
    const body = await readJsonBody(request);
    const name = Object.hasOwn(body, "name") ? body.name : current.name;
    const email = Object.hasOwn(body, "email") ? body.email : current.email;
    const user = updateUser({ id, name, email });
    sendJson(response, 200, {
      id: user.id,
      name: user.name,
      email: user.email,
    });
    return;
  }

  if (request.method === "DELETE") {
    deleteUser(id);
    response.statusCode = 204;
    response.end();
    return;
  }

  response.setHeader("Allow", "GET, PATCH, DELETE");
  throw new Error("HTTP method is not allowed");
}
