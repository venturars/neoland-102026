/* global console */
import express from "express";
import { createUser } from "../../logic/create-user.js";
import { listUsers } from "../../logic/list-users.js";
import { findUserById } from "../../logic/find-user-by-id.js";
import { updateUser } from "../../logic/update-user.js";
import { deleteUser } from "../../logic/delete-user.js";

// The client listens only on this computer, so nobody else on the network can reach it.
const HOST = "127.0.0.1";
// The database program already uses 3000, so this client uses the next port.
const PORT = 3001;

const app = express();

// Reads the body of a request as JSON. Without a JSON body, request.body is undefined.
app.use(express.json());

app.post("/users", async (request, response) => {
  // The route checks the shape of the input. The rules stay in logic/.
  const body = request.body;
  if (body === undefined || body === null || typeof body !== "object") {
    response.status(400).json({ error: "The request is not valid." });
    return;
  }

  const name = body.name;
  const email = body.email;
  if (typeof name !== "string" || typeof email !== "string") {
    response.status(400).json({ error: "The request is not valid." });
    return;
  }

  try {
    const user = await createUser({ name, email });
    response.status(201).json(user);
  } catch (error) {
    if (
      error.message === "The name is missing." ||
      error.message === "The email is not valid."
    ) {
      response.status(400).json({ error: error.message });
      return;
    }
    if (error.message === "This email is already used.") {
      response.status(409).json({ error: error.message });
      return;
    }
    if (error.message !== "The database failed.") {
      // Not a sentence of the app: a real bug, so it is shown in the terminal.
      console.error(error);
    }
    response.status(500).json({ error: "The database failed." });
  }
});

app.get("/users", async (request, response) => {
  try {
    const users = await listUsers();
    response.status(200).json(users);
  } catch (error) {
    if (error.message !== "The database failed.") {
      console.error(error);
    }
    response.status(500).json({ error: "The database failed." });
  }
});

app.get("/users/:id", async (request, response) => {
  // The id comes from the path as text. Text that is not a number matches no user.
  const id = Number(request.params.id);

  try {
    const user = await findUserById({ id });
    response.status(200).json(user);
  } catch (error) {
    if (error.message === "No user was found.") {
      response.status(404).json({ error: error.message });
      return;
    }
    if (error.message !== "The database failed.") {
      console.error(error);
    }
    response.status(500).json({ error: "The database failed." });
  }
});

app.patch("/users/:id", async (request, response) => {
  const id = Number(request.params.id);

  const body = request.body;
  if (body === undefined || body === null || typeof body !== "object") {
    response.status(400).json({ error: "The request is not valid." });
    return;
  }

  // A field that is not sent stays undefined, so logic/ keeps the old value.
  const name = body.name;
  const email = body.email;
  if (name !== undefined && typeof name !== "string") {
    response.status(400).json({ error: "The request is not valid." });
    return;
  }
  if (email !== undefined && typeof email !== "string") {
    response.status(400).json({ error: "The request is not valid." });
    return;
  }

  try {
    const user = await updateUser({ id, name, email });
    response.status(200).json(user);
  } catch (error) {
    if (
      error.message === "There is nothing to update." ||
      error.message === "The name is missing." ||
      error.message === "The email is not valid."
    ) {
      response.status(400).json({ error: error.message });
      return;
    }
    if (error.message === "No user was found.") {
      response.status(404).json({ error: error.message });
      return;
    }
    if (error.message === "This email is already used.") {
      response.status(409).json({ error: error.message });
      return;
    }
    if (error.message !== "The database failed.") {
      console.error(error);
    }
    response.status(500).json({ error: "The database failed." });
  }
});

app.delete("/users/:id", async (request, response) => {
  const id = Number(request.params.id);

  try {
    await deleteUser({ id });
    response.status(204).end();
  } catch (error) {
    if (error.message === "No user was found.") {
      response.status(404).json({ error: error.message });
      return;
    }
    if (error.message !== "The database failed.") {
      console.error(error);
    }
    response.status(500).json({ error: "The database failed." });
  }
});

// A body that is not valid JSON would get an HTML answer from Express. This gives JSON instead.
app.use((error, request, response, next) => {
  if (error.type === "entity.parse.failed") {
    response.status(400).json({ error: "The request is not valid." });
    return;
  }
  next(error);
});

app.listen(PORT, HOST, () => {
  console.log("HTTP client on http://" + HOST + ":" + PORT);
});
