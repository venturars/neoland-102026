/* global console, URL */
import Fastify from "fastify";
import { createUser } from "../../logic/create-user.js";
import { listUsers } from "../../logic/list-users.js";
import { findUserById } from "../../logic/find-user-by-id.js";
import { updateUser } from "../../logic/update-user.js";
import { deleteUser } from "../../logic/delete-user.js";

const ORIGIN = "http://127.0.0.1:3002";
const NAME_IS_EMPTY = "Name is empty";
const EMAIL_IS_INVALID = "Email is invalid";
const EMAIL_IS_ALREADY_USED = "Email is already used";
const COULD_NOT_CREATE_THE_USER = "Could not create the user";
const COULD_NOT_LIST_THE_USERS = "Could not list the users";
const USER_NOT_FOUND = "User not found";
const COULD_NOT_FIND_THE_USER = "Could not find the user";
const COULD_NOT_UPDATE_THE_USER = "Could not update the user";
const COULD_NOT_DELETE_THE_USER = "Could not delete the user";

const address = new URL(ORIGIN);
const hostname = address.hostname;
const port = Number(address.port);
const app = Fastify();

app.post("/users", async (request, reply) => {
  try {
    const input = request.body;
    const name = input.name;
    const email = input.email;
    const user = await createUser({ name, email });
    reply.code(201);
    return reply.send(user);
  } catch (error) {
    if (error instanceof Error) {
      const message = error.message;
      if (message === NAME_IS_EMPTY) {
        reply.code(400);
        return reply.send({ message });
      }
      if (message === EMAIL_IS_INVALID) {
        reply.code(400);
        return reply.send({ message });
      }
      if (message === EMAIL_IS_ALREADY_USED) {
        reply.code(409);
        return reply.send({ message });
      }
    }
    reply.code(500);
    return reply.send({ message: COULD_NOT_CREATE_THE_USER });
  }
});

app.get("/users", async (request, reply) => {
  try {
    const users = await listUsers();
    reply.code(200);
    return reply.send(users);
  } catch {
    reply.code(500);
    return reply.send({ message: COULD_NOT_LIST_THE_USERS });
  }
});

app.get("/users/:id", async (request, reply) => {
  try {
    const id = request.params.id;
    const user = await findUserById(id);
    reply.code(200);
    return reply.send(user);
  } catch (error) {
    if (error instanceof Error) {
      const message = error.message;
      if (message === USER_NOT_FOUND) {
        reply.code(404);
        return reply.send({ message });
      }
    }
    reply.code(500);
    return reply.send({ message: COULD_NOT_FIND_THE_USER });
  }
});

app.patch("/users/:id", async (request, reply) => {
  try {
    const id = request.params.id;
    const input = request.body;
    const changes = {};
    if (input.name !== undefined) {
      changes.name = input.name;
    }
    if (input.email !== undefined) {
      changes.email = input.email;
    }
    const user = await updateUser(id, changes);
    reply.code(200);
    return reply.send(user);
  } catch (error) {
    if (error instanceof Error) {
      const message = error.message;
      if (message === NAME_IS_EMPTY) {
        reply.code(400);
        return reply.send({ message });
      }
      if (message === EMAIL_IS_INVALID) {
        reply.code(400);
        return reply.send({ message });
      }
      if (message === EMAIL_IS_ALREADY_USED) {
        reply.code(409);
        return reply.send({ message });
      }
      if (message === USER_NOT_FOUND) {
        reply.code(404);
        return reply.send({ message });
      }
    }
    reply.code(500);
    return reply.send({ message: COULD_NOT_UPDATE_THE_USER });
  }
});

app.delete("/users/:id", async (request, reply) => {
  try {
    const id = request.params.id;
    await deleteUser(id);
    reply.code(204);
    return reply.send();
  } catch (error) {
    if (error instanceof Error) {
      const message = error.message;
      if (message === USER_NOT_FOUND) {
        reply.code(404);
        return reply.send({ message });
      }
    }
    reply.code(500);
    return reply.send({ message: COULD_NOT_DELETE_THE_USER });
  }
});

app.setNotFoundHandler((request, reply) => {
  reply.code(404);
  reply.send();
});

await app.listen({ host: hostname, port });
console.log(ORIGIN);
