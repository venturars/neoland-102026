/* global console */
import { fastify } from "fastify";
import { createUser } from "../../logic/create-user.js";
import { listUsers } from "../../logic/list-users.js";
import { findUserById } from "../../logic/find-user-by-id.js";
import { updateUser } from "../../logic/update-user.js";
import { deleteUser } from "../../logic/delete-user.js";

// The program listens only on this computer, so nobody else on the network can reach it.
const HOST = "127.0.0.1";
// The database program uses 3000 and the HTTP client uses 3001, so the extension uses the next port.
const PORT = 3002;

const app = fastify();

app.post("/users", async (request, reply) => {
  // The route checks the shape of the input. The rules stay in logic/.
  const body = request.body;
  if (body === undefined || body === null || typeof body !== "object") {
    reply.code(400).send({ error: "The request is not valid." });
    return;
  }

  const name = body.name;
  const email = body.email;
  if (typeof name !== "string" || typeof email !== "string") {
    reply.code(400).send({ error: "The request is not valid." });
    return;
  }

  try {
    const user = await createUser({ name, email });
    reply.code(201).send(user);
  } catch (error) {
    if (
      error.message === "The name is missing." ||
      error.message === "The email is not valid."
    ) {
      reply.code(400).send({ error: error.message });
      return;
    }
    if (error.message === "This email is already used.") {
      reply.code(409).send({ error: error.message });
      return;
    }
    if (error.message !== "The database failed.") {
      // Not a sentence of the app: a real bug, so it is shown in the terminal.
      console.error(error);
    }
    reply.code(500).send({ error: "The database failed." });
  }
});

app.get("/users", async (request, reply) => {
  try {
    const users = await listUsers();
    reply.code(200).send(users);
  } catch (error) {
    if (error.message !== "The database failed.") {
      console.error(error);
    }
    reply.code(500).send({ error: "The database failed." });
  }
});

app.get("/users/:id", async (request, reply) => {
  // The id comes from the path as text. Text that is not a number matches no user.
  const id = Number(request.params.id);

  try {
    const user = await findUserById({ id });
    reply.code(200).send(user);
  } catch (error) {
    if (error.message === "No user was found.") {
      reply.code(404).send({ error: error.message });
      return;
    }
    if (error.message !== "The database failed.") {
      console.error(error);
    }
    reply.code(500).send({ error: "The database failed." });
  }
});

app.patch("/users/:id", async (request, reply) => {
  const id = Number(request.params.id);

  const body = request.body;
  if (body === undefined || body === null || typeof body !== "object") {
    reply.code(400).send({ error: "The request is not valid." });
    return;
  }

  // A field that is not sent stays undefined, so logic/ keeps the old value.
  const name = body.name;
  const email = body.email;
  if (name !== undefined && typeof name !== "string") {
    reply.code(400).send({ error: "The request is not valid." });
    return;
  }
  if (email !== undefined && typeof email !== "string") {
    reply.code(400).send({ error: "The request is not valid." });
    return;
  }

  try {
    const user = await updateUser({ id, name, email });
    reply.code(200).send(user);
  } catch (error) {
    if (
      error.message === "There is nothing to update." ||
      error.message === "The name is missing." ||
      error.message === "The email is not valid."
    ) {
      reply.code(400).send({ error: error.message });
      return;
    }
    if (error.message === "No user was found.") {
      reply.code(404).send({ error: error.message });
      return;
    }
    if (error.message === "This email is already used.") {
      reply.code(409).send({ error: error.message });
      return;
    }
    if (error.message !== "The database failed.") {
      console.error(error);
    }
    reply.code(500).send({ error: "The database failed." });
  }
});

app.delete("/users/:id", async (request, reply) => {
  const id = Number(request.params.id);

  try {
    await deleteUser({ id });
    reply.code(204).send();
  } catch (error) {
    if (error.message === "No user was found.") {
      reply.code(404).send({ error: error.message });
      return;
    }
    if (error.message !== "The database failed.") {
      console.error(error);
    }
    reply.code(500).send({ error: "The database failed." });
  }
});

// Fastify answers some failures before a route runs (broken JSON, wrong content type, body too large).
// Its default answer has its own shape, so this gives the same JSON as the routes.
app.setErrorHandler((error, request, reply) => {
  const status = error.statusCode;
  if (status >= 400 && status < 500) {
    reply.code(400).send({ error: "The request is not valid." });
    return;
  }
  console.error(error);
  reply.code(500).send({ error: "The database failed." });
});

// An unknown route answers 404 with no body.
app.setNotFoundHandler((request, reply) => {
  reply.code(404).send();
});

await app.listen({ host: HOST, port: PORT });
console.log("Extension server on http://" + HOST + ":" + PORT);
