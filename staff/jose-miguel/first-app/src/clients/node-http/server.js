import http from "node:http";
import { createUser } from "../../logic/create-user.js";
import { deleteUser } from "../../logic/delete-user.js";
import { findUserById } from "../../logic/find-user-by-id.js";
import { listUsers } from "../../logic/list-users.js";
import { updateUser } from "../../logic/update-user.js";
import { usersGenderCount } from "../../logic/users-gender-count.js";

const ORIGIN = "http://127.0.0.1:3004";
const ID_IS_INVALID = "Id is invalid";
const BODY_IS_INVALID = "Body is invalid";
const NAME_IS_EMPTY = "Name is empty";
const EMAIL_IS_INVALID = "Email is invalid";
const EMAIL_IS_ALREADY_USED = "Email is already used";
const USER_NOT_FOUND = "User not found";
const COULD_NOT_CREATE_THE_USER = "Could not create the user";
const COULD_NOT_LIST_THE_USERS = "Could not list the users";
const COULD_NOT_FIND_THE_USER = "Could not find the user";
const COULD_NOT_UPDATE_THE_USER = "Could not update the user";
const COULD_NOT_DELETE_THE_USER = "Could not delete the user";
const COULD_NOT_CLASSIFY_THE_USERS = "Could not classify the users";

const originUrl = new URL(ORIGIN);
const port = Number(originUrl.port);
const hostname = originUrl.hostname;

function parseUserId(rawId) {
  const hasOnlyDigits = /^[1-9][0-9]*$/.test(rawId);
  if (!hasOnlyDigits) {
    throw new Error(ID_IS_INVALID);
  }
  const id = Number(rawId);
  if (!Number.isSafeInteger(id)) {
    throw new Error(ID_IS_INVALID);
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
    throw new Error(BODY_IS_INVALID);
  }
  let body;
  try {
    body = JSON.parse(text);
  } catch {
    throw new Error(BODY_IS_INVALID);
  }
  if (body === null || typeof body !== "object" || Array.isArray(body)) {
    throw new Error(BODY_IS_INVALID);
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
    const changes = {};
    if (body.name !== undefined) {
      changes.name = body.name;
    }
    if (body.email !== undefined) {
      changes.email = body.email;
    }
    const user = await updateUser(id, changes);
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
    return COULD_NOT_LIST_THE_USERS;
  }
  if (req.method === "GET" && path === "/users/gender-count") {
    return COULD_NOT_CLASSIFY_THE_USERS;
  }
  if (req.method === "GET") {
    return COULD_NOT_FIND_THE_USER;
  }
  if (req.method === "POST") {
    return COULD_NOT_CREATE_THE_USER;
  }
  if (req.method === "PATCH") {
    return COULD_NOT_UPDATE_THE_USER;
  }
  return COULD_NOT_DELETE_THE_USER;
}

function sendError(error, req, res) {
  if (!(error instanceof Error)) {
    sendJson(res, 500, { message: couldNotMessage(req) });
    return;
  }
  const message = error.message;
  if (
    message === ID_IS_INVALID ||
    message === BODY_IS_INVALID ||
    message === NAME_IS_EMPTY ||
    message === EMAIL_IS_INVALID
  ) {
    sendJson(res, 400, { message });
    return;
  }
  if (message === EMAIL_IS_ALREADY_USED) {
    sendJson(res, 409, { message });
    return;
  }
  if (message === USER_NOT_FOUND) {
    sendJson(res, 404, { message });
    return;
  }
  if (
    message === COULD_NOT_CREATE_THE_USER ||
    message === COULD_NOT_LIST_THE_USERS ||
    message === COULD_NOT_FIND_THE_USER ||
    message === COULD_NOT_UPDATE_THE_USER ||
    message === COULD_NOT_DELETE_THE_USER ||
    message === COULD_NOT_CLASSIFY_THE_USERS
  ) {
    sendJson(res, 500, { message });
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

server.listen(port, hostname, () => {
  console.log(ORIGIN);
});

server.on("error", (error) => {
  if (error.code === "EADDRINUSE") {
    console.error(
      `Port ${port} is already in use. Stop the other pnpm node-http or free port ${port}.`,
    );
    process.exit(1);
  }
  throw error;
});
