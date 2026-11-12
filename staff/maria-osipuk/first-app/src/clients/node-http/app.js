import { error as logError, log } from "node:console";
import { createServer } from "node:http";

import { createUser } from "../../logic/create-user.js";
import { deleteUser } from "../../logic/delete-user.js";
import { findUserById } from "../../logic/find-user-by-id.js";
import { listUsers } from "../../logic/list-users.js";
import { updateUser } from "../../logic/update-user.js";

// This client only turns HTTP into calls to logic/ and back. The rules
// stay in logic/ and the SQL stays in the data server (pnpm start).
// It has no framework: node:http gives the raw request, so this file
// reads the route, the body and the id by hand.
const HOSTNAME = "127.0.0.1";
const PORT = 3004;
const ORIGIN = "http://" + HOSTNAME + ":" + PORT;
const USERS_PATH = "/users";
const USERS_PREFIX = "/users/";

// The messages thrown by logic/. This client answers them in English,
// as they are, and only decides which HTTP status each one gets.
const ID_IS_INVALID = "User id must be a positive integer";
const NAME_IS_REQUIRED = "User name is required";
const EMAIL_IS_INVALID = "User email is invalid";
const EMAIL_IS_REGISTERED = "User email is already registered";
const USER_DOES_NOT_EXIST = "User does not exist";
const UNABLE_TO_CREATE = "Unable to create user";
const UNABLE_TO_LIST = "Unable to list users";
const UNABLE_TO_FIND = "Unable to find user";
const UNABLE_TO_UPDATE = "Unable to update user";
const UNABLE_TO_DELETE = "Unable to delete user";

// This message is born here: a broken body fails before reaching logic/.
const REQUEST_JSON_IS_INVALID = "Request JSON is invalid";

const JSON_HEADERS = { "content-type": "application/json" };

const server = createServer((request, response) => {
  const method = request.method;
  const url = new URL(request.url, ORIGIN);
  const path = url.pathname;

  // The body arrives in pieces. It is joined here and read only when
  // the request ends, because the route needs the whole text.
  let raw = "";
  request.setEncoding("utf8");
  request.on("data", (chunk) => {
    raw += chunk;
  });

  request.on("end", async () => {
    // A body is only read for the two routes that need one. No body at
    // all, a JSON that is not an object, and "null" all become an empty
    // object, so logic/ answers that the name is missing instead of a
    // TypeError that would end in a 500.
    let body = {};

    if (method === "POST" || method === "PATCH") {
      if (raw.trim() !== "") {
        let parsed;

        try {
          parsed = JSON.parse(raw);
        } catch {
          response.writeHead(400, JSON_HEADERS);
          response.end(JSON.stringify({ message: REQUEST_JSON_IS_INVALID }));
          return;
        }

        const isObject = typeof parsed === "object";
        const isNull = parsed === null;
        const isArray = Array.isArray(parsed);

        if (isObject && !isNull && !isArray) {
          body = parsed;
        }
      }
    }

    if (path === USERS_PATH && method === "POST") {
      try {
        const name = body.name;
        const email = body.email;
        const user = await createUser(name, email);
        response.writeHead(201, JSON_HEADERS);
        response.end(JSON.stringify(user));
      } catch (error) {
        if (error instanceof Error) {
          const message = error.message;

          if (message === NAME_IS_REQUIRED || message === EMAIL_IS_INVALID) {
            response.writeHead(400, JSON_HEADERS);
            response.end(JSON.stringify({ message }));
            return;
          }

          if (message === EMAIL_IS_REGISTERED) {
            response.writeHead(409, JSON_HEADERS);
            response.end(JSON.stringify({ message }));
            return;
          }
        }

        // Anything else answers the message of this operation, so an
        // unknown text never reaches the person who made the request.
        response.writeHead(500, JSON_HEADERS);
        response.end(JSON.stringify({ message: UNABLE_TO_CREATE }));
      }

      return;
    }

    if (path === USERS_PATH && method === "GET") {
      try {
        const users = await listUsers();
        response.writeHead(200, JSON_HEADERS);
        response.end(JSON.stringify(users));
      } catch {
        response.writeHead(500, JSON_HEADERS);
        response.end(JSON.stringify({ message: UNABLE_TO_LIST }));
      }

      return;
    }

    // The three routes with an id: the text after "/users/" is the id.
    // An empty id or one with another "/" inside is not a route.
    const hasIdPrefix = path.startsWith(USERS_PREFIX);
    const idText = path.slice(USERS_PREFIX.length);
    const idIsOneSegment = idText !== "" && !idText.includes("/");

    if (hasIdPrefix && idIsOneSegment) {
      // The route gives text and logic/ needs a number. The number is
      // used only if it writes back the same text: "1e3" would silently
      // become 1000, so it stays as text and logic/ rejects it.
      const idNumber = Number(idText);
      const idNumberText = String(idNumber);
      let id = idText;

      if (idNumberText === idText) {
        id = idNumber;
      }

      if (method === "GET") {
        try {
          const user = await findUserById(id);
          response.writeHead(200, JSON_HEADERS);
          response.end(JSON.stringify(user));
        } catch (error) {
          if (error instanceof Error) {
            const message = error.message;

            if (message === ID_IS_INVALID) {
              response.writeHead(400, JSON_HEADERS);
              response.end(JSON.stringify({ message }));
              return;
            }

            if (message === USER_DOES_NOT_EXIST) {
              response.writeHead(404, JSON_HEADERS);
              response.end(JSON.stringify({ message }));
              return;
            }
          }

          response.writeHead(500, JSON_HEADERS);
          response.end(JSON.stringify({ message: UNABLE_TO_FIND }));
        }

        return;
      }

      if (method === "PATCH") {
        try {
          // updateUser looks at which keys exist, so a field that was
          // not sent must not be in changes: that is how it keeps the
          // value already stored.
          const changes = {};

          if (body.name !== undefined) {
            changes.name = body.name;
          }

          if (body.email !== undefined) {
            changes.email = body.email;
          }

          const user = await updateUser(id, changes);
          response.writeHead(200, JSON_HEADERS);
          response.end(JSON.stringify(user));
        } catch (error) {
          if (error instanceof Error) {
            const message = error.message;

            if (
              message === ID_IS_INVALID ||
              message === NAME_IS_REQUIRED ||
              message === EMAIL_IS_INVALID
            ) {
              response.writeHead(400, JSON_HEADERS);
              response.end(JSON.stringify({ message }));
              return;
            }

            if (message === EMAIL_IS_REGISTERED) {
              response.writeHead(409, JSON_HEADERS);
              response.end(JSON.stringify({ message }));
              return;
            }

            if (message === USER_DOES_NOT_EXIST) {
              response.writeHead(404, JSON_HEADERS);
              response.end(JSON.stringify({ message }));
              return;
            }
          }

          response.writeHead(500, JSON_HEADERS);
          response.end(JSON.stringify({ message: UNABLE_TO_UPDATE }));
        }

        return;
      }

      if (method === "DELETE") {
        try {
          await deleteUser(id);
          response.writeHead(204);
          response.end();
        } catch (error) {
          if (error instanceof Error) {
            const message = error.message;

            if (message === ID_IS_INVALID) {
              response.writeHead(400, JSON_HEADERS);
              response.end(JSON.stringify({ message }));
              return;
            }

            if (message === USER_DOES_NOT_EXIST) {
              response.writeHead(404, JSON_HEADERS);
              response.end(JSON.stringify({ message }));
              return;
            }

            // deleteUser looks for the user first, so without the data
            // server this is the message that arrives, not the one
            // about deleting.
            if (message === UNABLE_TO_FIND) {
              response.writeHead(500, JSON_HEADERS);
              response.end(JSON.stringify({ message }));
              return;
            }
          }

          response.writeHead(500, JSON_HEADERS);
          response.end(JSON.stringify({ message: UNABLE_TO_DELETE }));
        }

        return;
      }
    }

    // Any other route or method is not part of this client.
    response.writeHead(404);
    response.end();
  });
});

// If the port is taken, listen fails with an error event. Without this
// listener Node would end with a long stack trace.
server.on("error", () => {
  logError(
    "No se ha podido iniciar el cliente node:http. Comprueba si el puerto 3004 está ocupado.",
  );
  process.exitCode = 1;
});

// Listen only on this computer, like the data server.
server.listen(PORT, HOSTNAME, () => {
  log("First App node:http client: " + ORIGIN);
});
