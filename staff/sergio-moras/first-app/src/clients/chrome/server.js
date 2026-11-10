// API de la extensión de Chrome: recibe sus peticiones, llama a las funciones de logic/ y responde en JSON.
// La extensión no puede importar logic/ porque Chrome solo carga los ficheros de su carpeta; por eso existe esta API.
// No valida nada: el resultado y el mensaje del error salen tal cual de logic/.
// Solo atiende a la extensión: una petición con otro Origin recibe 403.

import Fastify from "fastify";
import { listUsers } from "../../logic/list-users.js";
import { createUser } from "../../logic/create-user.js";
import { updateUser } from "../../logic/update-user.js";
import { deleteUser } from "../../logic/delete-user.js";

const HOST = "127.0.0.1";
const PORT = 3001;

// El id sale de la clave pública de extension/manifest.json, así que no cambia.
const EXTENSION_ORIGIN = "chrome-extension://fcepgeglkjghlkbhbfiojhkjbmbglcho";

// Cómo empieza el mensaje de cada tipo de fallo. Los mensajes están en docs/ERRORS.md.
const BAD_REQUEST_STARTS = [
  "Name is required.",
  "Email is required.",
  "Invalid email:",
  "Invalid id:",
  "Provide a new name, a new email, or both.",
];
const NOT_FOUND_START = "User not found:";
const CONFLICT_START = "Email already exists:";
const DATABASE_STOPPED_START = "Database is not running.";

// Fastify marca así los errores al leer el cuerpo: no es JSON, está vacío o no es de un tipo que entienda.
const BODY_ERROR_START = "FST_ERR_CTP_";

// Devuelve el código HTTP de un error de logic/ según cómo empieza su mensaje.
function getStatus(message) {
  for (const start of BAD_REQUEST_STARTS) {
    if (message.startsWith(start)) {
      return 400;
    }
  }
  if (message.startsWith(NOT_FOUND_START)) {
    return 404;
  }
  if (message.startsWith(CONFLICT_START)) {
    return 409;
  }
  if (message.startsWith(DATABASE_STOPPED_START)) {
    return 503;
  }
  return 500;
}

// Antes de cada ruta. El Origin lo pone el navegador, así que una web no puede hacerse pasar por la extensión.
// Sin Origin (curl, la terminal) se deja pasar, como en el servidor de la base.
async function checkOrigin(request, reply) {
  const origin = request.headers.origin;
  if (origin !== undefined && origin !== EXTENSION_ORIGIN) {
    reply.code(403);
    return reply.send({ error: "Forbidden origin." });
  }
}

// Sin cuerpo, request.body no existe: cuenta como que faltan los datos.
function getBody(request) {
  if (request.body) {
    return request.body;
  }
  return {};
}

// GET /users
async function list() {
  return await listUsers();
}

// POST /users con { name, email }
async function create(request, reply) {
  const body = getBody(request);
  const user = await createUser(body.name, body.email);
  reply.code(201);
  return user;
}

// PATCH /users/<id> con { name }, { email } o los dos. Lo que no se envía no cambia.
async function update(request) {
  const body = getBody(request);
  return await updateUser(request.params.id, body.name, body.email);
}

// DELETE /users/<id>
async function remove(request) {
  const deletedId = await deleteUser(request.params.id);
  return { id: deletedId };
}

// Fastify llega aquí con el error de cualquier ruta.
function handleError(error, request, reply) {
  if (
    typeof error.code === "string" &&
    error.code.startsWith(BODY_ERROR_START)
  ) {
    reply.code(400);
    return reply.send({ error: "Invalid request." });
  }
  const status = getStatus(error.message);
  reply.code(status);
  return reply.send({ error: error.message });
}

function handleNotFound(request, reply) {
  reply.code(404);
  return reply.send({ error: "Not found." });
}

const app = Fastify();
// Fastify también lee texto plano; esta API solo acepta JSON.
app.removeContentTypeParser("text/plain");
app.addHook("onRequest", checkOrigin);

app.get("/users", list);
app.post("/users", create);
app.patch("/users/:id", update);
app.delete("/users/:id", remove);

app.setErrorHandler(handleError);
app.setNotFoundHandler(handleNotFound);

await app.listen({ host: HOST, port: PORT });
console.log("Chrome extension API: http://" + HOST + ":" + PORT);
