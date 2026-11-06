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
const USER_ID_IS_NOT_VALID = "User id is not valid";
const NO_USER_EXISTS_WITH_THAT_ID = "No user exists with that id";
const COULD_NOT_CREATE_THE_USER = "Could not create the user";
const COULD_NOT_LIST_THE_USERS = "Could not list the users";
const COULD_NOT_FIND_THE_USER = "Could not find the user";
const COULD_NOT_UPDATE_THE_USER = "Could not update the user";
const COULD_NOT_DELETE_THE_USER = "Could not delete the user";
const JSON_CONTENT_TYPE = { "content-type": "application/json" };
const USERS_PREFIX = "/users/";

const originUrl = new URL(ORIGIN);
const portText = originUrl.port;
const port = Number(portText);
const hostname = originUrl.hostname;

const server = createServer((request, response) => {
  const method = request.method;
  const requestUrl = new URL(request.url, ORIGIN);
  const path = requestUrl.pathname;

  let raw = "";
  request.setEncoding("utf8");
  request.on("data", (chunk) => {
    raw += chunk;
  });
  request.on("end", async () => {
    let body = {};
    if (raw !== "") {
      try {
        body = JSON.parse(raw);
      } catch {
        response.writeHead(500);
        response.end();
        return;
      }
    }

    if (method === "POST") {
      if (path === "/users") {
        try {
          const name = body.name;
          const email = body.email;
          const user = await createUser({ name, email });
          const bodyText = JSON.stringify(user);
          response.writeHead(201, JSON_CONTENT_TYPE);
          response.end(bodyText);
          return;
        } catch (error) {
          if (error instanceof Error) {
            const message = error.message;
            if (message === NAME_IS_EMPTY) {
              const bodyText = JSON.stringify({ message });
              response.writeHead(400, JSON_CONTENT_TYPE);
              response.end(bodyText);
              return;
            }
            if (message === EMAIL_IS_INVALID) {
              const bodyText = JSON.stringify({ message });
              response.writeHead(400, JSON_CONTENT_TYPE);
              response.end(bodyText);
              return;
            }
            if (message === EMAIL_IS_ALREADY_USED) {
              const bodyText = JSON.stringify({ message });
              response.writeHead(409, JSON_CONTENT_TYPE);
              response.end(bodyText);
              return;
            }
            if (message === COULD_NOT_CREATE_THE_USER) {
              const bodyText = JSON.stringify({ message });
              response.writeHead(500, JSON_CONTENT_TYPE);
              response.end(bodyText);
              return;
            }
          }
          const bodyText = JSON.stringify({
            message: COULD_NOT_CREATE_THE_USER,
          });
          response.writeHead(500, JSON_CONTENT_TYPE);
          response.end(bodyText);
          return;
        }
      }
    }

    if (method === "GET") {
      if (path === "/users") {
        try {
          const users = await listUsers();
          const bodyText = JSON.stringify(users);
          response.writeHead(200, JSON_CONTENT_TYPE);
          response.end(bodyText);
          return;
        } catch (error) {
          if (error instanceof Error) {
            const message = error.message;
            if (message === COULD_NOT_LIST_THE_USERS) {
              const bodyText = JSON.stringify({ message });
              response.writeHead(500, JSON_CONTENT_TYPE);
              response.end(bodyText);
              return;
            }
          }
          const bodyText = JSON.stringify({
            message: COULD_NOT_LIST_THE_USERS,
          });
          response.writeHead(500, JSON_CONTENT_TYPE);
          response.end(bodyText);
          return;
        }
      }
    }

    const startsWithUsers = path.startsWith(USERS_PREFIX);
    if (startsWithUsers) {
      const id = path.slice(USERS_PREFIX.length);
      const hasSlash = id.includes("/");
      if (id !== "") {
        if (!hasSlash) {
          if (method === "GET") {
            try {
              const user = await findUserById(id);
              const bodyText = JSON.stringify(user);
              response.writeHead(200, JSON_CONTENT_TYPE);
              response.end(bodyText);
              return;
            } catch (error) {
              if (error instanceof Error) {
                const message = error.message;
                if (message === USER_ID_IS_NOT_VALID) {
                  const bodyText = JSON.stringify({ message });
                  response.writeHead(400, JSON_CONTENT_TYPE);
                  response.end(bodyText);
                  return;
                }
                if (message === NO_USER_EXISTS_WITH_THAT_ID) {
                  const bodyText = JSON.stringify({ message });
                  response.writeHead(404, JSON_CONTENT_TYPE);
                  response.end(bodyText);
                  return;
                }
                if (message === COULD_NOT_FIND_THE_USER) {
                  const bodyText = JSON.stringify({ message });
                  response.writeHead(500, JSON_CONTENT_TYPE);
                  response.end(bodyText);
                  return;
                }
              }
              const bodyText = JSON.stringify({
                message: COULD_NOT_FIND_THE_USER,
              });
              response.writeHead(500, JSON_CONTENT_TYPE);
              response.end(bodyText);
              return;
            }
          }

          if (method === "PATCH") {
            try {
              const input = { id };
              if (body.name !== undefined) {
                input.name = body.name;
              }
              if (body.email !== undefined) {
                input.email = body.email;
              }
              const user = await updateUser(input);
              const bodyText = JSON.stringify(user);
              response.writeHead(200, JSON_CONTENT_TYPE);
              response.end(bodyText);
              return;
            } catch (error) {
              if (error instanceof Error) {
                const message = error.message;
                if (message === NAME_IS_EMPTY) {
                  const bodyText = JSON.stringify({ message });
                  response.writeHead(400, JSON_CONTENT_TYPE);
                  response.end(bodyText);
                  return;
                }
                if (message === EMAIL_IS_INVALID) {
                  const bodyText = JSON.stringify({ message });
                  response.writeHead(400, JSON_CONTENT_TYPE);
                  response.end(bodyText);
                  return;
                }
                if (message === EMAIL_IS_ALREADY_USED) {
                  const bodyText = JSON.stringify({ message });
                  response.writeHead(409, JSON_CONTENT_TYPE);
                  response.end(bodyText);
                  return;
                }
                if (message === USER_ID_IS_NOT_VALID) {
                  const bodyText = JSON.stringify({ message });
                  response.writeHead(400, JSON_CONTENT_TYPE);
                  response.end(bodyText);
                  return;
                }
                if (message === NO_USER_EXISTS_WITH_THAT_ID) {
                  const bodyText = JSON.stringify({ message });
                  response.writeHead(404, JSON_CONTENT_TYPE);
                  response.end(bodyText);
                  return;
                }
                if (message === COULD_NOT_UPDATE_THE_USER) {
                  const bodyText = JSON.stringify({ message });
                  response.writeHead(500, JSON_CONTENT_TYPE);
                  response.end(bodyText);
                  return;
                }
              }
              const bodyText = JSON.stringify({
                message: COULD_NOT_UPDATE_THE_USER,
              });
              response.writeHead(500, JSON_CONTENT_TYPE);
              response.end(bodyText);
              return;
            }
          }

          if (method === "DELETE") {
            try {
              await deleteUser({ id });
              response.writeHead(204);
              response.end();
              return;
            } catch (error) {
              if (error instanceof Error) {
                const message = error.message;
                if (message === USER_ID_IS_NOT_VALID) {
                  const bodyText = JSON.stringify({ message });
                  response.writeHead(400, JSON_CONTENT_TYPE);
                  response.end(bodyText);
                  return;
                }
                if (message === NO_USER_EXISTS_WITH_THAT_ID) {
                  const bodyText = JSON.stringify({ message });
                  response.writeHead(404, JSON_CONTENT_TYPE);
                  response.end(bodyText);
                  return;
                }
                if (message === COULD_NOT_DELETE_THE_USER) {
                  const bodyText = JSON.stringify({ message });
                  response.writeHead(500, JSON_CONTENT_TYPE);
                  response.end(bodyText);
                  return;
                }
              }
              const bodyText = JSON.stringify({
                message: COULD_NOT_DELETE_THE_USER,
              });
              response.writeHead(500, JSON_CONTENT_TYPE);
              response.end(bodyText);
              return;
            }
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
