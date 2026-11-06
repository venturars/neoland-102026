import express from "express";
import { createUser } from "../../logic/create-user.js";
import { deleteUser } from "../../logic/delete-user.js";
import {
  ConflictError,
  DatabaseError,
  NotFoundError,
  ValidationError,
} from "../../logic/errors.js";
import { findUserById } from "../../logic/find-user-by-id.js";
import { listUsers } from "../../logic/list-users.js";
import { updateUser } from "../../logic/update-user.js";
import { usersGenderCount } from "../../logic/user-gender-count.js";

const HOST = "127.0.0.1";
const ORIGIN = "http://127.0.0.1";
const PORT = 3001;

const app = express();

app.use(express.json());

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

app.get("/users", async (req, res) => {
  const users = await listUsers();

  res.status(200).json(users);
});

app.get("/users/gender-count", async (req, res) => {
  const count = await usersGenderCount();

  res.status(200).json(count);
});

app.get("/users/:id", async (req, res) => {
  const id = parseUserId(req.params.id);
  const user = await findUserById(id);

  res.status(200).json(user);
});

app.post("/users", async (req, res) => {
  checkBody(req.body);

  const name = req.body.name;
  const email = req.body.email;
  const user = await createUser({ name, email });

  res.status(201).json(user);
});

app.patch("/users/:id", async (req, res) => {
  const id = parseUserId(req.params.id);

  checkBody(req.body);

  const name = req.body.name;
  const email = req.body.email;
  const user = await updateUser({ id, name, email });

  res.status(200).json(user);
});

app.delete("/users/:id", async (req, res) => {
  const id = parseUserId(req.params.id);
  await deleteUser(id);

  res.status(204).end();
});

app.use((req, res) => {
  res.status(404).end();
});

// Express identifies an error middleware by its four parameters.
// eslint-disable-next-line no-unused-vars
app.use((error, req, res, next) => {
  if (error.type === "entity.parse.failed") {
    res.status(400).json({ message: "Body is invalid" });

    return;
  }

  if (error instanceof ValidationError) {
    res.status(400).json({ message: error.message });

    return;
  }

  if (error instanceof NotFoundError) {
    res.status(404).json({ message: error.message });

    return;
  }

  if (error instanceof ConflictError) {
    res.status(409).json({ message: error.message });

    return;
  }

  if (error instanceof DatabaseError) {
    res.status(500).json({ message: error.message });

    return;
  }

  let couldNot = "";

  if (req.method === "GET") {
    if (req.path === "/users") {
      couldNot = "Could not list the users";
    }
  }

  if (req.method === "GET") {
    if (req.path !== "/users") {
      if (req.path.startsWith("/users/")) {
        couldNot = "Could not find the user";
      }
    }
  }

  if (req.method === "POST") {
    if (req.path === "/users") {
      couldNot = "Could not create the user";
    }
  }

  if (req.method === "PATCH") {
    if (req.path.startsWith("/users/")) {
      couldNot = "Could not update the user";
    }
  }

  if (req.method === "DELETE") {
    if (req.path.startsWith("/users/")) {
      couldNot = "Could not delete the user";
    }
  }

  if (couldNot === "") {
    res.status(404).end();

    return;
  }

  res.status(500).json({ message: couldNot });
});

app.listen(PORT, HOST, (error) => {
  if (error) {
    throw error;
  }

  console.log(`HTTP server listening on ${ORIGIN}:${PORT}`);
});
