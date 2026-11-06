/* global console, URL */
import Fastify from "fastify";
import { createUser } from "../../logic/create-user.js";
import { deleteUser } from "../../logic/delete-user.js";
import { listUsers } from "../../logic/list-users.js";
import { updateUser } from "../../logic/update-user.js";

const ORIGIN = "http://127.0.0.1:3002";
const NAME_IS_REQUIRED = "Name is required";
const NAME_IS_TOO_LONG = "Name must be at most 100 characters";
const EMAIL_IS_REQUIRED = "Email is required";
const EMAIL_IS_NOT_VALID = "Email is not valid";
const ID_IS_INVALID = "User id must be a positive integer";
const UPDATE_NEEDS_A_FIELD = "Provide a name or an email to update";
const WAS_NOT_FOUND = "was not found";
const UNIQUE_CONSTRAINT = "UNIQUE constraint";

const originUrl = new URL(ORIGIN);

function statusFor(error) {
  if (!(error instanceof Error)) {
    return 500;
  }

  if (error instanceof SyntaxError) {
    return 400;
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
    return 400;
  }

  if (message.endsWith(WAS_NOT_FOUND)) {
    return 404;
  }

  if (message.includes(UNIQUE_CONSTRAINT)) {
    return 409;
  }

  return 500;
}

function messageFor(error) {
  if (error instanceof Error) {
    return error.message;
  }

  return String(error);
}

const fastify = Fastify();

fastify.removeContentTypeParser("application/json");
fastify.addContentTypeParser(
  /^application\/json($|;)/,
  { parseAs: "string" },
  (request, raw, done) => {
    if (raw.length === 0) {
      done(null, {});
      return;
    }

    try {
      done(null, JSON.parse(raw));
    } catch (error) {
      done(error);
    }
  },
);

fastify.addHook("onRequest", async (request, reply) => {
  reply.header("access-control-allow-origin", "*");
  reply.header(
    "access-control-allow-methods",
    "GET, POST, PATCH, DELETE, OPTIONS",
  );
  reply.header("access-control-allow-headers", "content-type");

  if (request.method === "OPTIONS") {
    reply.code(204).send();
  }
});

fastify.setErrorHandler((error, request, reply) => {
  reply.code(statusFor(error)).send({ message: messageFor(error) });
});

fastify.setNotFoundHandler((request, reply) => {
  reply.code(404).send();
});

fastify.get("/users", async () => {
  return listUsers();
});

fastify.post("/users", async (request, reply) => {
  const body = request.body ?? {};
  const user = await createUser({ name: body.name, email: body.email });
  reply.code(201);
  return user;
});

fastify.patch("/users/:id", async (request) => {
  const body = request.body ?? {};
  const changes = {};

  if (body.name !== undefined) {
    changes.name = body.name;
  }

  if (body.email !== undefined) {
    changes.email = body.email;
  }

  return updateUser(request.params.id, changes);
});

fastify.delete("/users/:id", async (request, reply) => {
  await deleteUser(request.params.id);
  reply.code(204).send();
});

await fastify.listen({
  host: originUrl.hostname,
  port: Number(originUrl.port),
});
console.log(ORIGIN);
