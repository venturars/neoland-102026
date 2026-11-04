// Calls the people rules and answers JSON. It does not decide if a name or an email is valid.

import express from "express";
import { listUsers } from "../../logic/list-users.js";
import { findUserById } from "../../logic/find-user-by-id.js";
import { findUserByEmail } from "../../logic/find-user-by-email.js";
import { createUser } from "../../logic/create-user.js";
import { updateUser } from "../../logic/update-user.js";
import { deleteUser } from "../../logic/delete-user.js";
import { usersGenderCount } from "../../logic/users-gender-count.js";

const HOST = "127.0.0.1";
const PORT = 3001;

const BAD_REQUEST = new Set([
  "Name is empty",
  "Email is invalid",
  "Invalid id",
]);
const DATABASE_STOPPED = "Database is not running. Start it with npm run db.";

function readId(value) {
  if (!/^[1-9]\d*$/.test(value)) {
    throw new Error("Invalid id");
  }
  const id = Number(value);
  if (!Number.isSafeInteger(id)) {
    throw new Error("Invalid id");
  }
  return id;
}

function readBody(request) {
  if (request.body) {
    return request.body;
  }
  return {};
}

function statusFor(message) {
  if (BAD_REQUEST.has(message)) {
    return 400;
  }
  if (message === "User not found") {
    return 404;
  }
  if (message === "Email is already used") {
    return 409;
  }
  if (message === DATABASE_STOPPED) {
    return 503;
  }
  return 500;
}

async function list(request, response) {
  response.json(await listUsers());
}

async function findById(request, response) {
  response.json(await findUserById(readId(request.params.id)));
}

async function findByEmail(request, response) {
  response.json(await findUserByEmail(request.params.email));
}

async function create(request, response) {
  const body = readBody(request);
  const user = await createUser({ name: body.name, email: body.email });
  response.status(201);
  response.json(user);
}

async function update(request, response) {
  const body = readBody(request);
  const changes = {};
  if (body.name !== undefined) {
    changes.name = body.name;
  }
  if (body.email !== undefined) {
    changes.email = body.email;
  }
  response.json(await updateUser(readId(request.params.id), changes));
}

async function remove(request, response) {
  const id = readId(request.params.id);
  await deleteUser(id);
  response.json({ id });
}

async function countGenders(request, response) {
  response.json(await usersGenderCount());
}

function handleNotFound(request, response) {
  response.status(404);
  response.json({ error: "Not found." });
}

// Express uses four parameters to mark this as the error handler.
// eslint-disable-next-line no-unused-vars
function handleError(error, request, response, next) {
  if (error.type === "entity.parse.failed") {
    response.status(400);
    response.json({ error: "Invalid request." });
    return;
  }
  response.status(statusFor(error.message));
  response.json({ error: error.message });
}

const app = express();
app.use(express.json());

app.get("/users", list);
app.get("/users/genders", countGenders);
app.get("/users/email/:email", findByEmail);
app.get("/users/:id", findById);
app.post("/users", create);
app.patch("/users/:id", update);
app.delete("/users/:id", remove);

app.use(handleNotFound);
app.use(handleError);

app.listen(PORT, HOST, function () {
  console.log("REST API: http://" + HOST + ":" + PORT);
});
