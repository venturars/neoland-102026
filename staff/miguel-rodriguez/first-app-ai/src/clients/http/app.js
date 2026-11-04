import express from "express";
import { usersGenderCount } from "../../logic/users-gender-count.js";
import { createUser } from "../../logic/create-user.js";
import { listUsers } from "../../logic/list-users.js";
import { findUserById } from "../../logic/find-user-by-id.js";
import { updateUser } from "../../logic/update-user.js";
import { deleteUser } from "../../logic/delete-user.js";

const HOST = "127.0.0.1";
const PORT = 3001;
const app = express();
app.use(express.json());

app.post("/users", async (request, response) => {
  try {
    const body = request.body;
    const name = body.name;
    const email = body.email;
    const user = await createUser({ name, email });
    response.status(201);
    response.json(user);
  } catch (error) {
    const isError = error instanceof Error;
    if (isError) {
      const message = error.message;
      const nameIsEmpty = message === "Name is empty";
      if (nameIsEmpty) {
        response.status(400);
        response.json({ message });
        return;
      }
      const emailIsInvalid = message === "Email is invalid";
      if (emailIsInvalid) {
        response.status(400);
        response.json({ message });
        return;
      }
      const emailIsAlreadyUsed = message === "Email is already used";
      if (emailIsAlreadyUsed) {
        response.status(409);
        response.json({ message });
        return;
      }
    }
    response.status(500);
    response.json({ message: "Could not create the user" });
  }
});

app.get("/users", async (request, response) => {
  try {
    const users = await listUsers();
    response.status(200);
    response.json(users);
  } catch {
    response.status(500);
    response.json({ message: "Could not list the users" });
  }
});

app.get("/users/gender-count", async (request, response) => {
  try {
    const counts = await usersGenderCount();
    response.status(200);
    response.json(counts);
  } catch {
    response.status(500);
    response.json({ message: "Could not classify the users" });
  }
});

app.get("/users/:id", async (request, response) => {
  try {
    const idText = request.params.id;
    const id = Number(idText);
    const user = await findUserById(id);
    response.status(200);
    response.json(user);
  } catch (error) {
    const isError = error instanceof Error;
    if (isError) {
      const message = error.message;
      const userIsMissing = message === "User not found";
      if (userIsMissing) {
        response.status(404);
        response.json({ message });
        return;
      }
    }
    response.status(500);
    response.json({ message: "Could not find the user" });
  }
});

app.patch("/users/:id", async (request, response) => {
  try {
    const idText = request.params.id;
    const id = Number(idText);
    const body = request.body;
    const name = body.name;
    const email = body.email;
    const changes = { name, email };
    const user = await updateUser(id, changes);
    response.status(200);
    response.json(user);
  } catch (error) {
    const isError = error instanceof Error;
    if (isError) {
      const message = error.message;
      const nameIsEmpty = message === "Name is empty";
      if (nameIsEmpty) {
        response.status(400);
        response.json({ message });
        return;
      }
      const emailIsInvalid = message === "Email is invalid";
      if (emailIsInvalid) {
        response.status(400);
        response.json({ message });
        return;
      }
      const emailIsAlreadyUsed = message === "Email is already used";
      if (emailIsAlreadyUsed) {
        response.status(409);
        response.json({ message });
        return;
      }
      const userIsMissing = message === "User not found";
      if (userIsMissing) {
        response.status(404);
        response.json({ message });
        return;
      }
    }
    response.status(500);
    response.json({ message: "Could not update the user" });
  }
});

app.delete("/users/:id", async (request, response) => {
  try {
    const idText = request.params.id;
    const id = Number(idText);
    await deleteUser(id);
    response.status(204);
    response.end();
  } catch (error) {
    const isError = error instanceof Error;
    if (isError) {
      const message = error.message;
      const userIsMissing = message === "User not found";
      if (userIsMissing) {
        response.status(404);
        response.json({ message });
        return;
      }
    }
    response.status(500);
    response.json({ message: "Could not delete the user" });
  }
});

app.use((request, response) => {
  response.status(404);
  response.end();
});

app.use((error, request, response, next) => {
  const headersSent = response.headersSent;
  if (headersSent) {
    next(error);
    return;
  }
  const malformedJson = error.type === "entity.parse.failed";
  if (malformedJson) {
    response.status(400);
    response.end();
    return;
  }
  next(error);
});

const server = app.listen(PORT, HOST, () => {
  console.log(`http://${HOST}:${PORT}`);
});
server.on("error", (error) => {
  console.error(error.message);
  process.exitCode = 1;
});
