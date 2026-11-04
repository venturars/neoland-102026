// Cliente API REST: recibe peticiones HTTP, llama a las funciones de logic/ y responde en JSON.
// No valida nada: el resultado y el mensaje del error salen tal cual de logic/.
// Lo único que decide es el código HTTP de cada error, según cómo empieza su mensaje.

import express from "express";
import { listUsers } from "../../logic/list-users.js";
import { findUserByName } from "../../logic/find-user-by-name.js";
import { findUserByEmail } from "../../logic/find-user-by-email.js";
import { createUser } from "../../logic/create-user.js";
import { updateUser } from "../../logic/update-user.js";
import { deleteUser } from "../../logic/delete-user.js";
import { classifyGender } from "../../logic/classify-gender.js";

const HOST = "127.0.0.1";
const PORT = 3000;

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
const CLASSIFY_FAILED_START = "Users could not be classified:";
const DATABASE_STOPPED_START = "Database is not running.";

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
  if (message.startsWith(CLASSIFY_FAILED_START)) {
    return 502;
  }
  if (message.startsWith(DATABASE_STOPPED_START)) {
    return 503;
  }
  return 500;
}

// GET /users lista todos. Con ?name= busca los que se llaman exactamente así.
async function listOrFindByName(request, response) {
  const name = request.query.name;
  if (name === undefined) {
    const users = await listUsers();
    response.json(users);
    return;
  }
  const users = await findUserByName(name);
  response.json(users);
}

// GET /users/email/<email>
async function findByEmail(request, response) {
  const user = await findUserByEmail(request.params.email);
  response.json(user);
}

// POST /users con { name, email }
async function create(request, response) {
  // Sin cuerpo JSON, request.body no existe: cuenta como que faltan los datos.
  let body = {};
  if (request.body) {
    body = request.body;
  }
  const user = await createUser(body.name, body.email);
  response.status(201);
  response.json(user);
}

// PATCH /users/<id> con { name }, { email } o los dos. Lo que no se envía no cambia.
async function update(request, response) {
  let body = {};
  if (request.body) {
    body = request.body;
  }
  const user = await updateUser(request.params.id, body.name, body.email);
  response.json(user);
}

// DELETE /users/<id>
async function remove(request, response) {
  const deletedId = await deleteUser(request.params.id);
  response.json({ id: deletedId });
}

// GET /users/genders
async function countGenders(request, response) {
  const counts = await classifyGender();
  response.json(counts);
}

function handleNotFound(request, response) {
  response.status(404);
  response.json({ error: "Not found." });
}

// Express llega aquí con el error de cualquier ruta. Los cuatro parámetros le dicen que es el manejador de errores.
// eslint-disable-next-line no-unused-vars
function handleError(error, request, response, next) {
  // express.json() marca así un cuerpo que no es JSON.
  if (error.type === "entity.parse.failed") {
    response.status(400);
    response.json({ error: "Invalid request." });
    return;
  }
  const status = getStatus(error.message);
  response.status(status);
  response.json({ error: error.message });
}

const app = express();
app.use(express.json());

app.get("/users", listOrFindByName);
app.get("/users/genders", countGenders);
app.get("/users/email/:email", findByEmail);
app.post("/users", create);
app.patch("/users/:id", update);
app.delete("/users/:id", remove);

app.use(handleNotFound);
app.use(handleError);

app.listen(PORT, HOST, function () {
  console.log("REST API: http://" + HOST + ":" + PORT);
});
