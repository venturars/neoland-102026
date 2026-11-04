import Fastify from "fastify";
import { createUser } from "../../logic/create-user.js";
import { deleteUser } from "../../logic/delete-user.js";
import { findUserById } from "../../logic/find-user-by-id.js";
import { listUsers } from "../../logic/list-users.js";
import { updateUser } from "../../logic/update-user.js";

const ORIGIN = "http://127.0.0.1:3002";
const NAME_IS_EMPTY = "Name is empty";
const EMAIL_IS_INVALID = "Email is invalid";
const EMAIL_IS_ALREADY_USED = "Email is already used";
const USER_ID_IS_NOT_VALID = "User id is not valid";
const NO_USER_EXISTS_WITH_THAT_ID = "No user exists with that id";
const USER_NOT_FOUND = "User not found";
const COULD_NOT_CREATE_THE_USER = "Could not create the user";
const COULD_NOT_LIST_THE_USERS = "Could not list the users";
const COULD_NOT_FIND_THE_USER = "Could not find the user";
const COULD_NOT_UPDATE_THE_USER = "Could not update the user";
const COULD_NOT_DELETE_THE_USER = "Could not delete the user";

const originUrl = new URL(ORIGIN);
const portText = originUrl.port;
const port = Number(portText);
const hostname = originUrl.hostname;

const app = Fastify();

app.post("/users", async (request, reply) => {
  try {
    const body = request.body;
    const name = body.name;
    const email = body.email;
    const user = await createUser({ name, email });
    reply.code(201);
    reply.send(user);
  } catch (error) {
    if (error instanceof Error) {
      const message = error.message;
      if (message === NAME_IS_EMPTY) {
        reply.code(400);
        reply.send({ message });
        return;
      }
      if (message === EMAIL_IS_INVALID) {
        reply.code(400);
        reply.send({ message });
        return;
      }
      if (message === EMAIL_IS_ALREADY_USED) {
        reply.code(409);
        reply.send({ message });
        return;
      }
      if (message === COULD_NOT_CREATE_THE_USER) {
        reply.code(500);
        reply.send({ message });
        return;
      }
    }
    reply.code(500);
    reply.send({ message: COULD_NOT_CREATE_THE_USER });
  }
});

app.get("/users", async (request, reply) => {
  try {
    const users = await listUsers();
    reply.code(200);
    reply.send(users);
  } catch (error) {
    if (error instanceof Error) {
      const message = error.message;
      if (message === COULD_NOT_LIST_THE_USERS) {
        reply.code(500);
        reply.send({ message });
        return;
      }
    }
    reply.code(500);
    reply.send({ message: COULD_NOT_LIST_THE_USERS });
  }
});

app.get("/users/:id", async (request, reply) => {
  try {
    const id = request.params.id;
    const user = await findUserById(id);
    reply.code(200);
    reply.send(user);
  } catch (error) {
    if (error instanceof Error) {
      const message = error.message;
      if (message === USER_ID_IS_NOT_VALID) {
        reply.code(400);
        reply.send({ message });
        return;
      }
      if (message === NO_USER_EXISTS_WITH_THAT_ID) {
        reply.code(404);
        reply.send({ message: USER_NOT_FOUND });
        return;
      }
      if (message === COULD_NOT_FIND_THE_USER) {
        reply.code(500);
        reply.send({ message });
        return;
      }
    }
    reply.code(500);
    reply.send({ message: COULD_NOT_FIND_THE_USER });
  }
});

app.patch("/users/:id", async (request, reply) => {
  try {
    const id = request.params.id;
    const body = request.body;
    const input = { id };
    if (body.name !== undefined) {
      input.name = body.name;
    }
    if (body.email !== undefined) {
      input.email = body.email;
    }
    const user = await updateUser(input);
    reply.code(200);
    reply.send(user);
  } catch (error) {
    if (error instanceof Error) {
      const message = error.message;
      if (message === NAME_IS_EMPTY) {
        reply.code(400);
        reply.send({ message });
        return;
      }
      if (message === EMAIL_IS_INVALID) {
        reply.code(400);
        reply.send({ message });
        return;
      }
      if (message === EMAIL_IS_ALREADY_USED) {
        reply.code(409);
        reply.send({ message });
        return;
      }
      if (message === USER_ID_IS_NOT_VALID) {
        reply.code(400);
        reply.send({ message });
        return;
      }
      if (message === NO_USER_EXISTS_WITH_THAT_ID) {
        reply.code(404);
        reply.send({ message: USER_NOT_FOUND });
        return;
      }
      if (message === COULD_NOT_UPDATE_THE_USER) {
        reply.code(500);
        reply.send({ message });
        return;
      }
    }
    reply.code(500);
    reply.send({ message: COULD_NOT_UPDATE_THE_USER });
  }
});

app.delete("/users/:id", async (request, reply) => {
  try {
    const id = request.params.id;
    await deleteUser({ id });
    reply.code(204);
    reply.send();
  } catch (error) {
    if (error instanceof Error) {
      const message = error.message;
      if (message === USER_ID_IS_NOT_VALID) {
        reply.code(400);
        reply.send({ message });
        return;
      }
      if (message === NO_USER_EXISTS_WITH_THAT_ID) {
        reply.code(404);
        reply.send({ message: USER_NOT_FOUND });
        return;
      }
      if (message === COULD_NOT_DELETE_THE_USER) {
        reply.code(500);
        reply.send({ message });
        return;
      }
    }
    reply.code(500);
    reply.send({ message: COULD_NOT_DELETE_THE_USER });
  }
});

app.setNotFoundHandler((request, reply) => {
  reply.code(404);
  reply.send();
});

const listenOptions = {
  port,
  host: hostname,
};
await app.listen(listenOptions);
console.log(ORIGIN);
