/* global console, URL */
import express from "express";
import { createUser } from "../../logic/create-user.js";
import { deleteUser } from "../../logic/delete-user.js";
import { findUserByEmail } from "../../logic/find-user-by-email.js";
import { findUserById } from "../../logic/find-user-by-id.js";
import { findUserByName } from "../../logic/find-user-by-name.js";
import { listUsers } from "../../logic/list-users.js";
import { updateUser } from "../../logic/update-user.js";

const ORIGIN = "http://127.0.0.1:3001";
const NAME_IS_REQUIRED = "Name is required";
const NAME_IS_TOO_LONG = "Name must be at most 100 characters";
const EMAIL_IS_REQUIRED = "Email is required";
const EMAIL_IS_NOT_VALID = "Email is not valid";
const ID_IS_INVALID = "User id must be a positive integer";
const UPDATE_NEEDS_A_FIELD = "Provide a name or an email to update";
const WAS_NOT_FOUND = "was not found";
const UNIQUE_CONSTRAINT = "UNIQUE constraint";

const originUrl = new URL(ORIGIN);
const port = Number(originUrl.port);
const hostname = originUrl.hostname;

function sendError(response, error) {
  if (!(error instanceof Error)) {
    response.status(500);
    response.json({ message: String(error) });
    return;
  }

  const message = error.message;

  if (
    message === NAME_IS_REQUIRED ||
    message === NAME_IS_TOO_LONG ||
    message === EMAIL_IS_REQUIRED ||
    message === EMAIL_IS_NOT_VALID ||
    message === ID_IS_INVALID ||
    message === UPDATE_NEEDS_A_FIELD
  ) {
    response.status(400);
    response.json({ message });
    return;
  }

  if (message.endsWith(WAS_NOT_FOUND)) {
    response.status(404);
    response.json({ message });
    return;
  }

  if (message.includes(UNIQUE_CONSTRAINT)) {
    response.status(409);
    response.json({ message });
    return;
  }

  response.status(500);
  response.json({ message });
}

const app = express();
const readJson = express.json();
app.use(readJson);

app.post("/users", async (request, response) => {
  try {
    const body = request.body;
    const name = body.name;
    const email = body.email;
    const user = await createUser({ name, email });
    response.status(201);
    response.json(user);
  } catch (error) {
    sendError(response, error);
  }
});

app.get("/users/email/:email", async (request, response) => {
  try {
    const email = request.params.email;
    const user = await findUserByEmail(email);
    response.status(200);
    response.json(user);
  } catch (error) {
    sendError(response, error);
  }
});

app.get("/users/name/:name", async (request, response) => {
  try {
    const name = request.params.name;
    const users = await findUserByName(name);
    response.status(200);
    response.json(users);
  } catch (error) {
    sendError(response, error);
  }
});

app.get("/users", async (request, response) => {
  try {
    const users = await listUsers();
    response.status(200);
    response.json(users);
  } catch (error) {
    sendError(response, error);
  }
});

app.get("/users/:id", async (request, response) => {
  try {
    const id = request.params.id;
    const user = await findUserById(id);
    response.status(200);
    response.json(user);
  } catch (error) {
    sendError(response, error);
  }
});

app.patch("/users/:id", async (request, response) => {
  try {
    const id = request.params.id;
    const body = request.body;
    const changes = {};

    if (body.name !== undefined) {
      changes.name = body.name;
    }

    if (body.email !== undefined) {
      changes.email = body.email;
    }

    const user = await updateUser(id, changes);
    response.status(200);
    response.json(user);
  } catch (error) {
    sendError(response, error);
  }
});

app.delete("/users/:id", async (request, response) => {
  try {
    const id = request.params.id;
    await deleteUser(id);
    response.status(204);
    response.end();
  } catch (error) {
    sendError(response, error);
  }
});

app.use((request, response) => {
  response.status(404);
  response.end();
});

app.use((error, request, response, next) => {
  if (error instanceof SyntaxError && error.status === 400) {
    response.status(400);
    response.json({ message: error.message });
    return;
  }

  next(error);
});

app.listen(port, hostname, () => {
  console.log(ORIGIN);
});
