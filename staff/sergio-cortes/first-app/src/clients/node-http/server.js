import http from "node:http";
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
const PORT = 3004;

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

function readText(req) {
  return new Promise((resolve, reject) => {
    let text = "";

    req.on("data", (chunk) => {
      text += chunk;
    });
    req.on("end", () => {
      resolve(text);
    });
    req.on("error", reject);
  });
}

async function readJsonBody(req) {
  const text = await readText(req);

  if (text === "") {
    throw new ValidationError("Body is invalid");
  }

  let body;

  try {
    body = JSON.parse(text);
  } catch {
    throw new ValidationError("Body is invalid");
  }

  if (body === null || typeof body !== "object") {
    throw new ValidationError("Body is invalid");
  }

  return body;
}

function sendJson(res, status, data) {
  res.writeHead(status, { "Content-Type": "application/json" });
  res.end(JSON.stringify(data));
}

function sendEmpty(res, status) {
  res.writeHead(status);
  res.end();
}

function requestPath(req) {
  return new URL(req.url, ORIGIN).pathname;
}

async function handleRequest(req, res) {
  const path = requestPath(req);
  const idMatch = /^\/users\/([^/]+)$/.exec(path);

  if (req.method === "GET" && path === "/users") {
    const users = await listUsers();

    sendJson(res, 200, users);
    return;
  }

  if (req.method === "POST" && path === "/users") {
    const body = await readJsonBody(req);
    const user = await createUser({ name: body.name, email: body.email });

    sendJson(res, 201, user);
    return;
  }

  if (req.method === "GET" && path === "/users/gender-count") {
    const count = await usersGenderCount();

    sendJson(res, 200, count);
    return;
  }

  if (req.method === "GET" && idMatch !== null) {
    const id = parseUserId(idMatch[1]);
    const user = await findUserById(id);

    sendJson(res, 200, user);
    return;
  }

  if (req.method === "PATCH" && idMatch !== null) {
    const id = parseUserId(idMatch[1]);
    const body = await readJsonBody(req);
    const user = await updateUser({ id, name: body.name, email: body.email });

    sendJson(res, 200, user);
    return;
  }

  if (req.method === "DELETE" && idMatch !== null) {
    const id = parseUserId(idMatch[1]);

    await deleteUser(id);
    sendEmpty(res, 204);
    return;
  }

  sendEmpty(res, 404);
}

function couldNotMessage(req) {
  const path = requestPath(req);

  if (req.method === "GET" && path === "/users") {
    return "Could not list the users";
  }

  if (req.method === "GET" && path === "/users/gender-count") {
    return "Could not classify the users";
  }

  if (req.method === "GET") {
    return "Could not find the user";
  }

  if (req.method === "POST") {
    return "Could not create the user";
  }

  if (req.method === "PATCH") {
    return "Could not update the user";
  }

  return "Could not delete the user";
}

function sendError(error, req, res) {
  if (error instanceof ValidationError) {
    sendJson(res, 400, { message: error.message });
    return;
  }

  if (error instanceof NotFoundError) {
    sendJson(res, 404, { message: error.message });
    return;
  }

  if (error instanceof ConflictError) {
    sendJson(res, 409, { message: error.message });
    return;
  }

  if (error instanceof DatabaseError) {
    sendJson(res, 500, { message: error.message });
    return;
  }

  sendJson(res, 500, { message: couldNotMessage(req) });
}

const server = http.createServer(async (req, res) => {
  try {
    await handleRequest(req, res);
  } catch (error) {
    sendError(error, req, res);
  }
});

server.listen(PORT, HOST, () => {
  console.log(`node-http server listening on ${ORIGIN}:${PORT}`);
});
