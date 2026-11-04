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
  const user = await deleteUser(id);

  res.status(200).json(user);
});

// Express identifies an error middleware by its four parameters.
// eslint-disable-next-line no-unused-vars
app.use((error, req, res, next) => {
  if (error.type === "entity.parse.failed") {
    res.status(400).json({ error: "Body is invalid" });

    return;
  }

  if (error instanceof ValidationError) {
    res.status(400).json({ error: error.message });

    return;
  }

  if (error instanceof NotFoundError) {
    res.status(404).json({ error: error.message });

    return;
  }

  if (error instanceof ConflictError) {
    res.status(409).json({ error: error.message });

    return;
  }

  if (error instanceof DatabaseError) {
    res.status(500).json({ error: error.message });

    return;
  }

  res.status(500).json({ error: "Internal error" });
});

app.listen(PORT, HOST, (error) => {
  if (error) {
    throw error;
  }

  console.log(`HTTP server listening on ${ORIGIN}:${PORT}`);
});
