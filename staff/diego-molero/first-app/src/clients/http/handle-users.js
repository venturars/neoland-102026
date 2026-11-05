import { createUser } from "../../logic/create-user.js";
import { listUsers } from "../../logic/list-users.js";
import { findUserById } from "../../logic/find-user-by-id.js";
import { updateUser } from "../../logic/update-user.js";
import { deleteUser } from "../../logic/delete-user.js";
import { parseId, requireJson, methodNotAllowed } from "./request-helpers.js";

// Las rutas REST delegan las reglas y la persistencia a la lógica existente.
export function registerUserRoutes(app) {
  app.all("/api/users", (request, response) => {
    if (request.method === "GET") return response.json(listUsers());
    if (request.method === "POST") {
      requireJson(request);
      return response.status(201).json(createUser(request.body));
    }
    return methodNotAllowed(response, "GET, POST");
  });

  app.all("/api/users/:userId", (request, response) => {
    if (!["GET", "PATCH", "DELETE"].includes(request.method)) {
      return methodNotAllowed(response, "GET, PATCH, DELETE");
    }
    const userId = parseId(request.params.userId, "User");
    if (request.method === "GET") return response.json(findUserById(userId));
    if (request.method === "PATCH") {
      requireJson(request);
      return response.json(updateUser(userId, request.body));
    }
    deleteUser(userId);
    return response.sendStatus(204);
  });
}
