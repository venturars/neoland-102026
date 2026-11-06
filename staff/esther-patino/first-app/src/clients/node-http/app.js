/* global console, URL */
import { createServer } from "node:http";
import { createUser } from "../../logic/create-user.js";
import { deleteUser } from "../../logic/delete-user.js";
import { findUserById } from "../../logic/find-user-by-id.js";
import { listUsers } from "../../logic/list-users.js";
import { updateUser } from "../../logic/update-user.js";

const ORIGIN = "http://127.0.0.1:3004";
const NAME_IS_EMPTY = "Name is empty";
const EMAIL_IS_INVALID = "Email is invalid";
const EMAIL_IS_ALREADY_USED = "Email is already used";
const INVALID_ID = "Invalid id";
const USER_NOT_FOUND = "User not found";
const COULD_NOT_CREATE_THE_USER = "Could not create the user";
const COULD_NOT_LIST_THE_USERS = "Could not list the users";
const COULD_NOT_FIND_THE_USER = "Could not find the user";
const COULD_NOT_UPDATE_THE_USER = "Could not update the user";
const COULD_NOT_DELETE_THE_USER = "Could not delete the user";
const USERS_PATH = "/users";
const USERS_PREFIX = "/users/";
const JSON_HEADERS = {
  "content-type": "application/json",
};

const originUrl = new URL(ORIGIN);
const portText = originUrl.port;
const port = Number(portText);
const hostname = originUrl.hostname;

const server = createServer((request, response) => {
  const method = request.method;
  const url = new URL(request.url, ORIGIN);
  const path = url.pathname;

  let raw = "";
  request.setEncoding("utf8");
  request.on("data", (chunk) => {
    raw += chunk;
  });
  request.on("end", async () => {
    if (path === USERS_PATH) {
      if (method === "POST") {
        let body;
        try {
          body = JSON.parse(raw);
        } catch {
          response.writeHead(500, JSON_HEADERS);
          const payload = { message: COULD_NOT_CREATE_THE_USER };
          response.end(JSON.stringify(payload));
          return;
        }
        try {
          const name = body.name;
          const email = body.email;
          const user = await createUser({ name, email });
          response.writeHead(201, JSON_HEADERS);
          response.end(JSON.stringify(user));
        } catch (error) {
          if (error instanceof Error) {
            const message = error.message;
            if (message === NAME_IS_EMPTY) {
              response.writeHead(400, JSON_HEADERS);
              response.end(JSON.stringify({ message }));
              return;
            }
            if (message === EMAIL_IS_INVALID) {
              response.writeHead(400, JSON_HEADERS);
              response.end(JSON.stringify({ message }));
              return;
            }
            if (message === EMAIL_IS_ALREADY_USED) {
              response.writeHead(409, JSON_HEADERS);
              response.end(JSON.stringify({ message }));
              return;
            }
            if (message === COULD_NOT_CREATE_THE_USER) {
              response.writeHead(500, JSON_HEADERS);
              response.end(JSON.stringify({ message }));
              return;
            }
          }
          response.writeHead(500, JSON_HEADERS);
          const payload = { message: COULD_NOT_CREATE_THE_USER };
          response.end(JSON.stringify(payload));
        }
        return;
      }
      if (method === "GET") {
        try {
          const users = await listUsers();
          response.writeHead(200, JSON_HEADERS);
          response.end(JSON.stringify(users));
        } catch (error) {
          if (error instanceof Error) {
            const message = error.message;
            if (message === COULD_NOT_LIST_THE_USERS) {
              response.writeHead(500, JSON_HEADERS);
              response.end(JSON.stringify({ message }));
              return;
            }
          }
          response.writeHead(500, JSON_HEADERS);
          const payload = { message: COULD_NOT_LIST_THE_USERS };
          response.end(JSON.stringify(payload));
        }
        return;
      }
    }

    const startsWithUsers = path.startsWith(USERS_PREFIX);
    if (startsWithUsers) {
      const rawId = path.slice(USERS_PREFIX.length);
      const hasExtraSlash = rawId.includes("/");
      if (rawId !== "") {
        if (hasExtraSlash === false) {
          const id = Number(rawId);
          if (method === "GET") {
            try {
              const user = await findUserById(id);
              response.writeHead(200, JSON_HEADERS);
              response.end(JSON.stringify(user));
            } catch (error) {
              if (error instanceof Error) {
                const message = error.message;
                if (message === INVALID_ID) {
                  response.writeHead(400, JSON_HEADERS);
                  response.end(JSON.stringify({ message }));
                  return;
                }
                if (message === USER_NOT_FOUND) {
                  response.writeHead(404, JSON_HEADERS);
                  response.end(JSON.stringify({ message }));
                  return;
                }
                if (message === COULD_NOT_FIND_THE_USER) {
                  response.writeHead(500, JSON_HEADERS);
                  response.end(JSON.stringify({ message }));
                  return;
                }
              }
              response.writeHead(500, JSON_HEADERS);
              const payload = { message: COULD_NOT_FIND_THE_USER };
              response.end(JSON.stringify(payload));
            }
            return;
          }
          if (method === "PATCH") {
            let body;
            try {
              body = JSON.parse(raw);
            } catch {
              response.writeHead(500, JSON_HEADERS);
              const payload = { message: COULD_NOT_UPDATE_THE_USER };
              response.end(JSON.stringify(payload));
              return;
            }
            try {
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
                if (message === NAME_IS_EMPTY) {
                  response.writeHead(400, JSON_HEADERS);
                  response.end(JSON.stringify({ message }));
                  return;
                }
                if (message === EMAIL_IS_INVALID) {
                  response.writeHead(400, JSON_HEADERS);
                  response.end(JSON.stringify({ message }));
                  return;
                }
                if (message === EMAIL_IS_ALREADY_USED) {
                  response.writeHead(409, JSON_HEADERS);
                  response.end(JSON.stringify({ message }));
                  return;
                }
                if (message === INVALID_ID) {
                  response.writeHead(400, JSON_HEADERS);
                  response.end(JSON.stringify({ message }));
                  return;
                }
                if (message === USER_NOT_FOUND) {
                  response.writeHead(404, JSON_HEADERS);
                  response.end(JSON.stringify({ message }));
                  return;
                }
                if (message === COULD_NOT_UPDATE_THE_USER) {
                  response.writeHead(500, JSON_HEADERS);
                  response.end(JSON.stringify({ message }));
                  return;
                }
              }
              response.writeHead(500, JSON_HEADERS);
              const payload = { message: COULD_NOT_UPDATE_THE_USER };
              response.end(JSON.stringify(payload));
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
                if (message === INVALID_ID) {
                  response.writeHead(400, JSON_HEADERS);
                  response.end(JSON.stringify({ message }));
                  return;
                }
                if (message === USER_NOT_FOUND) {
                  response.writeHead(404, JSON_HEADERS);
                  response.end(JSON.stringify({ message }));
                  return;
                }
                if (message === COULD_NOT_DELETE_THE_USER) {
                  response.writeHead(500, JSON_HEADERS);
                  response.end(JSON.stringify({ message }));
                  return;
                }
              }
              response.writeHead(500, JSON_HEADERS);
              const payload = { message: COULD_NOT_DELETE_THE_USER };
              response.end(JSON.stringify(payload));
            }
            return;
          }
        }
      }
    }

    response.writeHead(404);
    response.end();
  });
});

server.listen(port, hostname, () => {
  console.log(ORIGIN);
});
