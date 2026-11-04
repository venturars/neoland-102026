import { listUsers } from "../../logic/list-users.js";
import { findUserById } from "../../logic/find-user-by-id.js";
import { updateUser } from "../../logic/update-user.js";
import { deleteUser } from "../../logic/delete-user.js";
import { readJsonBody } from "./read-json-body.js";
import { sendJson } from "./send-json.js";

function userIdFromPath(value) {
  if (!/^\d+$/u.test(value)) {
    throw new Error("User ID is invalid");
  }
  const id = Number(value);
  if (!Number.isSafeInteger(id) || id <= 0) {
    throw new Error("User ID is invalid");
  }
  return id;
}

// Las rutas reutilizan las operaciones existentes de usuarios.
export async function handleUsers(request, response, path) {
  if (path === "/api/users") {
    if (request.method !== "GET") {
      response.setHeader("Allow", "GET");
      sendJson(response, 405, { message: "Método no permitido." });
      return true;
    }
    sendJson(response, 200, listUsers());
    return true;
  }
  const match = /^\/api\/users\/([^/]+)$/u.exec(path);
  if (!match) {
    return false;
  }
  if (!["GET", "PATCH", "DELETE"].includes(request.method)) {
    response.setHeader("Allow", "GET, PATCH, DELETE");
    sendJson(response, 405, { message: "Método no permitido." });
    return true;
  }
  const userId = userIdFromPath(match[1]);
  if (request.method === "GET") {
    sendJson(response, 200, findUserById(userId));
  } else if (request.method === "PATCH") {
    const changes = await readJsonBody(request);
    sendJson(response, 200, updateUser(userId, changes));
  } else {
    deleteUser(userId);
    sendJson(response, 204);
  }
  return true;
}
