import { deleteUser } from "../../logic/delete-user.js";
import { findUserById } from "../../logic/find-user-by-id.js";
import { listUsers } from "../../logic/list-users.js";
import { updateUser } from "../../logic/update-user.js";
import { readJsonBody } from "./read-json-body.js";
import { sendJson } from "./send-json.js";

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

  const rawId = parts[3];
  const hasOnlyDigits = /^[1-9][0-9]*$/.test(rawId);

  if (!hasOnlyDigits) {
    throw new Error("Invalid id");
  }

  const id = Number(rawId);

  if (!Number.isSafeInteger(id)) {
    throw new Error("Invalid id");
  }

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
    const body = await readJsonBody(request);
    const changes = {};

    if (Object.hasOwn(body, "name")) {
      changes.name = body.name;
    }

    if (Object.hasOwn(body, "email")) {
      changes.email = body.email;
    }

    const user = updateUser(id, changes);
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
