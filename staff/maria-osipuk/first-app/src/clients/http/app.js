import { error, log } from "node:console";
import { once } from "node:events";
import { createServer } from "node:http";

import { createUser } from "../../logic/create-user.js";
import { deleteUser } from "../../logic/delete-user.js";
import { updateUser } from "../../logic/update-user.js";
import { readJsonBody } from "./read-json-body.js";
import { sendHttpError } from "./send-http-error.js";
import { sendJson } from "./send-json.js";

// The data server already uses 3000, so this client listens on 3001.
const HOSTNAME = "127.0.0.1";
const PORT = 3001;

export function createHttpServer() {
  // Keep creation separate from listening so a test can choose a free port.
  return createServer(handleRequest);
}

async function handleRequest(request, response) {
  try {
    // The base is only used to read a relative path. No external URL is fetched.
    const requestUrl = new URL(request.url, "http://" + HOSTNAME);
    const pathname = requestUrl.pathname;

    if (pathname === "/api/users") {
      await handleUsersCollection(request, response);
      return;
    }

    if (pathname.startsWith("/api/users/")) {
      await handleUserResource(request, response, pathname);
      return;
    }

    // This client no longer serves the web page or any other file.
    throw new Error("HTTP resource does not exist");
  } catch (error) {
    // Every failed request gets a safe response, including an unexpected failure.
    sendHttpError(response, error);
  }
}

async function handleUsersCollection(request, response) {
  // The collection only creates. Listing users is not part of this client.
  if (request.method !== "POST") {
    response.setHeader("Allow", "POST");
    throw new Error("HTTP method is not allowed");
  }

  const body = await readJsonBody(request);

  // createUser validates and normalizes both values, so they pass as they came.
  const user = await createUser(body.name, body.email);
  sendJson(response, 201, {
    id: user.id,
    name: user.name,
    email: user.email,
  });
}

async function handleUserResource(request, response, pathname) {
  const parts = pathname.split("/");

  if (parts.length !== 4) {
    throw new Error("HTTP resource does not exist");
  }

  // A route contains text. Check the whole segment before converting it,
  // so values such as "1abc" or "1.5" cannot select a different user.
  const rawId = parts[3];
  const hasOnlyDigits = /^[1-9][0-9]*$/.test(rawId);

  if (!hasOnlyDigits) {
    throw new Error("User id must be a positive integer");
  }

  const id = Number(rawId);

  if (!Number.isSafeInteger(id)) {
    throw new Error("User id must be a positive integer");
  }

  if (request.method === "PATCH") {
    const body = await readJsonBody(request);
    const changes = {};

    // Copy only editable properties, without inventing values for absent ones.
    // The existing function still validates and normalizes their actual values.
    if (Object.hasOwn(body, "name")) {
      changes.name = body.name;
    }

    if (Object.hasOwn(body, "email")) {
      changes.email = body.email;
    }

    const user = await updateUser(id, changes);
    sendJson(response, 200, {
      id: user.id,
      name: user.name,
      email: user.email,
    });
    return;
  }

  if (request.method === "DELETE") {
    await deleteUser(id);
    response.statusCode = 204;
    response.end();
    return;
  }

  // Reading one user is not part of this client either.
  response.setHeader("Allow", "PATCH, DELETE");
  throw new Error("HTTP method is not allowed");
}

export async function startHttpServer() {
  const server = createHttpServer();

  // Listen only on this computer. Opening the page does not add a login.
  server.listen(PORT, HOSTNAME);
  await once(server, "listening");

  log("First App HTTP: http://" + HOSTNAME + ":" + PORT);
}

// Tests import createHttpServer without starting the real one.
if (import.meta.main) {
  try {
    await startHttpServer();
  } catch {
    error(
      "No se ha podido iniciar el cliente HTTP. Comprueba si el puerto 3001 está ocupado.",
    );
    process.exitCode = 1;
  }
}
