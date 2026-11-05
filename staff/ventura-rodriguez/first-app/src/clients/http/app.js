/* global console, URL */
import express from "express";
import { createUser } from "../../logic/create-user.js";
import { deleteUser } from "../../logic/delete-user.js";
import { findUserById } from "../../logic/find-user-by-id.js";
import { listUsers } from "../../logic/list-users.js";
import { updateUser } from "../../logic/update-user.js";

const ORIGIN = "http://127.0.0.1:3001";
const NAME_IS_EMPTY = "Name is empty";
const EMAIL_IS_INVALID = "Email is invalid";
const EMAIL_IS_ALREADY_USED = "Email is already used";
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
    if (error instanceof Error) {
      const message = error.message;
      if (message === NAME_IS_EMPTY) {
        response.status(400);
        response.json({ message });
        return;
      }
      if (message === EMAIL_IS_INVALID) {
        response.status(400);
        response.json({ message });
        return;
      }
      if (message === EMAIL_IS_ALREADY_USED) {
        response.status(409);
        response.json({ message });
        return;
      }
      if (message === COULD_NOT_CREATE_THE_USER) {
        response.status(500);
        response.json({ message });
        return;
      }
    }
    response.status(500);
    response.json({ message: COULD_NOT_CREATE_THE_USER });
  }
});

app.get("/users", async (request, response) => {
  try {
    const users = await listUsers();
    response.status(200);
    response.json(users);
  } catch (error) {
    if (error instanceof Error) {
      const message = error.message;
      if (message === COULD_NOT_LIST_THE_USERS) {
        response.status(500);
        response.json({ message });
        return;
      }
    }
    response.status(500);
    response.json({ message: COULD_NOT_LIST_THE_USERS });
  }
});

app.get("/users/:id", async (request, response) => {
  try {
    const id = request.params.id;
    const user = await findUserById(id);
    response.status(200);
    response.json(user);
  } catch (error) {
    if (error instanceof Error) {
      const message = error.message;
      if (message === USER_NOT_FOUND) {
        response.status(404);
        response.json({ message });
        return;
      }
      if (message === COULD_NOT_FIND_THE_USER) {
        response.status(500);
        response.json({ message });
        return;
      }
    }
    response.status(500);
    response.json({ message: COULD_NOT_FIND_THE_USER });
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
    if (error instanceof Error) {
      const message = error.message;
      if (message === NAME_IS_EMPTY) {
        response.status(400);
        response.json({ message });
        return;
      }
      if (message === EMAIL_IS_INVALID) {
        response.status(400);
        response.json({ message });
        return;
      }
      if (message === EMAIL_IS_ALREADY_USED) {
        response.status(409);
        response.json({ message });
        return;
      }
      if (message === USER_NOT_FOUND) {
        response.status(404);
        response.json({ message });
        return;
      }
      if (message === COULD_NOT_UPDATE_THE_USER) {
        response.status(500);
        response.json({ message });
        return;
      }
    }
    response.status(500);
    response.json({ message: COULD_NOT_UPDATE_THE_USER });
  }
});

app.delete("/users/:id", async (request, response) => {
  try {
    const id = request.params.id;
    await deleteUser(id);
    response.status(204);
    response.end();
  } catch (error) {
    if (error instanceof Error) {
      const message = error.message;
      if (message === USER_NOT_FOUND) {
        response.status(404);
        response.json({ message });
        return;
      }
      if (message === COULD_NOT_DELETE_THE_USER) {
        response.status(500);
        response.json({ message });
        return;
      }
    }
    response.status(500);
    response.json({ message: COULD_NOT_DELETE_THE_USER });
  }
});

app.use((request, response) => {
  response.status(404);
  response.end();
});

app.listen(port, hostname, () => {
  console.log(ORIGIN);
});
