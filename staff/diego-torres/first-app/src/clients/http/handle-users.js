import {
  deleteUser,
  findUserById,
  listUsers,
  updateUser,
} from "../../logic/index.js";
import { readJsonBody } from "./read-json-body.js";
import { sendJson } from "./send-json.js";

const USER_PATH = /^\/api\/users\/([^/]+)$/;

export async function handleUsers(store, request, response, pathname) {
  if (pathname === "/api/users" && request.method === "GET") {
    sendJson(response, 200, await listUsers(store));
    return;
  }

  const match = USER_PATH.exec(pathname);
  if (!match) {
    sendJson(response, 404, { error: "Not found" });
    return;
  }

  const id = decodeURIComponent(match[1]);

  if (request.method === "GET") {
    sendJson(response, 200, await findUserById(store, id));
    return;
  }

  if (request.method === "PATCH") {
    const body = await readJsonBody(request);
    const changes = { nombre: body?.nombre, email: body?.email };
    sendJson(response, 200, await updateUser(store, id, changes));
    return;
  }

  if (request.method === "DELETE") {
    sendJson(response, 200, await deleteUser(store, id));
    return;
  }

  sendJson(response, 404, { error: "Not found" });
}
