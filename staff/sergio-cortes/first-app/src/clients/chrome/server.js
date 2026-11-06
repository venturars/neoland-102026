import Fastify from "fastify";
import { createUser } from "../../logic/create-user.js";
import { deleteUser } from "../../logic/delete-user.js";
import {
  ConflictError,
  DatabaseError,
  NotFoundError,
  ValidationError,
} from "../../logic/errors.js";
import { findUserByEmail } from "../../logic/find-user-by-email.js";
import { findUserById } from "../../logic/find-user-by-id.js";
import { findUserByName } from "../../logic/find-user-by-name.js";
import { listUsers } from "../../logic/list-users.js";
import { updateUser } from "../../logic/update-user.js";
import { usersGenderCount } from "../../logic/user-gender-count.js";

const HOST = "127.0.0.1";
const ORIGIN = "http://127.0.0.1";
const PORT = 3002;

const app = Fastify();

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

function checkBody(body) {
  if (body === undefined) {
    throw new ValidationError("Body is invalid");
  }

  if (body === null) {
    throw new ValidationError("Body is invalid");
  }

  if (typeof body !== "object") {
    throw new ValidationError("Body is invalid");
  }
}

app.get("/users", async () => {
  const users = await listUsers();

  return users;
});

app.get("/users/by-name", async (request) => {
  const name = request.query.name;
  const users = await findUserByName(name);

  return users;
});

app.get("/users/by-email", async (request) => {
  const email = request.query.email;
  const user = await findUserByEmail(email);

  return user;
});

app.get("/users/gender-count", async () => {
  const count = await usersGenderCount();

  return count;
});

app.get("/users/:id", async (request) => {
  const id = parseUserId(request.params.id);
  const user = await findUserById(id);

  return user;
});

app.post("/users", async (request, reply) => {
  checkBody(request.body);

  const name = request.body.name;
  const email = request.body.email;
  const user = await createUser({ name, email });

  reply.status(201);

  return user;
});

app.patch("/users/:id", async (request) => {
  const id = parseUserId(request.params.id);

  checkBody(request.body);

  const name = request.body.name;
  const email = request.body.email;
  const user = await updateUser({ id, name, email });

  return user;
});

app.delete("/users/:id", async (request, reply) => {
  const id = parseUserId(request.params.id);
  await deleteUser(id);

  reply.status(204);
  return;
});

app.setNotFoundHandler((request, reply) => {
  reply.status(404);
  reply.send();
});

app.setErrorHandler((error, request, reply) => {
  if (error.code === "FST_ERR_CTP_INVALID_JSON_BODY") {
    reply.status(400).send({ message: "Body is invalid" });

    return;
  }

  if (error.code === "FST_ERR_CTP_EMPTY_JSON_BODY") {
    reply.status(400).send({ message: "Body is invalid" });

    return;
  }

  if (error instanceof ValidationError) {
    reply.status(400).send({ message: error.message });

    return;
  }

  if (error instanceof NotFoundError) {
    reply.status(404).send({ message: error.message });

    return;
  }

  if (error instanceof ConflictError) {
    reply.status(409).send({ message: error.message });

    return;
  }

  if (error instanceof DatabaseError) {
    reply.status(500).send({ message: error.message });

    return;
  }

  const url = request.url;
  const path = url.split("?")[0];
  let couldNot = "";

  if (request.method === "GET") {
    if (path === "/users") {
      couldNot = "Could not list the users";
    }
  }

  if (request.method === "GET") {
    if (path !== "/users") {
      if (path.startsWith("/users/")) {
        couldNot = "Could not find the user";
      }
    }
  }

  if (request.method === "POST") {
    if (path === "/users") {
      couldNot = "Could not create the user";
    }
  }

  if (request.method === "PATCH") {
    if (path.startsWith("/users/")) {
      couldNot = "Could not update the user";
    }
  }

  if (request.method === "DELETE") {
    if (path.startsWith("/users/")) {
      couldNot = "Could not delete the user";
    }
  }

  if (couldNot === "") {
    reply.status(404).send();

    return;
  }

  reply.status(500).send({ message: couldNot });
});

await app.listen({ port: PORT, host: HOST });

console.log(`HTTP server listening on ${ORIGIN}:${PORT}`);
