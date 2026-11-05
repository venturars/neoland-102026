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
const USER_NOT_FOUND = "User not found";
const COULD_NOT_CREATE_THE_USER = "Could not create the user";
const COULD_NOT_LIST_THE_USERS = "Could not list the users";
const COULD_NOT_FIND_THE_USER = "Could not find the user";
const COULD_NOT_UPDATE_THE_USER = "Could not update the user";
const COULD_NOT_DELETE_THE_USER = "Could not delete the user";

const originUrl = new URL(ORIGIN);
const portText = originUrl.port;
const port = Number(portText);
const hostname = originUrl.hostname;

const app = createServer(async (request, response) => {
  const requestUrl = new URL(request.url, ORIGIN);
  const pathname = requestUrl.pathname;
  const userPath = pathname.match(/^\/users\/([^/]+)\/?$/);

  if (
    request.method === "POST" &&
    (pathname === "/users" || pathname === "/users/")
  ) {
    try {
      request.setEncoding("utf8");
      let bodyText = "";
      for await (const chunk of request) {
        bodyText += chunk;
      }
      const body = JSON.parse(bodyText || "{}");
      const name = body.name;
      const email = body.email;
      const user = await createUser({ name, email });
      response.statusCode = 201;
      response.setHeader("content-type", "application/json");
      response.end(JSON.stringify(user));
    } catch (error) {
      if (error instanceof Error) {
        const message = error.message;
        if (message === NAME_IS_EMPTY) {
          response.statusCode = 400;
          response.setHeader("content-type", "application/json");
          response.end(JSON.stringify({ message }));
          return;
        }
        if (message === EMAIL_IS_INVALID) {
          response.statusCode = 400;
          response.setHeader("content-type", "application/json");
          response.end(JSON.stringify({ message }));
          return;
        }
        if (message === EMAIL_IS_ALREADY_USED) {
          response.statusCode = 409;
          response.setHeader("content-type", "application/json");
          response.end(JSON.stringify({ message }));
          return;
        }
        if (message === COULD_NOT_CREATE_THE_USER) {
          response.statusCode = 500;
          response.setHeader("content-type", "application/json");
          response.end(JSON.stringify({ message }));
          return;
        }
      }
      response.statusCode = 500;
      response.setHeader("content-type", "application/json");
      response.end(JSON.stringify({ message: COULD_NOT_CREATE_THE_USER }));
    }
    return;
  }

  if (
    request.method === "GET" &&
    (pathname === "/users" || pathname === "/users/")
  ) {
    try {
      const users = await listUsers();
      response.statusCode = 200;
      response.setHeader("content-type", "application/json");
      response.end(JSON.stringify(users));
    } catch (error) {
      if (error instanceof Error) {
        const message = error.message;
        if (message === COULD_NOT_LIST_THE_USERS) {
          response.statusCode = 500;
          response.setHeader("content-type", "application/json");
          response.end(JSON.stringify({ message }));
          return;
        }
      }
      response.statusCode = 500;
      response.setHeader("content-type", "application/json");
      response.end(JSON.stringify({ message: COULD_NOT_LIST_THE_USERS }));
    }
    return;
  }

  if (request.method === "GET" && userPath !== null) {
    try {
      const id = decodeURIComponent(userPath[1]);
      const user = await findUserById(id);
      response.statusCode = 200;
      response.setHeader("content-type", "application/json");
      response.end(JSON.stringify(user));
    } catch (error) {
      if (error instanceof Error) {
        const message = error.message;
        if (message === USER_NOT_FOUND) {
          response.statusCode = 404;
          response.setHeader("content-type", "application/json");
          response.end(JSON.stringify({ message }));
          return;
        }
        if (message === COULD_NOT_FIND_THE_USER) {
          response.statusCode = 500;
          response.setHeader("content-type", "application/json");
          response.end(JSON.stringify({ message }));
          return;
        }
      }
      response.statusCode = 500;
      response.setHeader("content-type", "application/json");
      response.end(JSON.stringify({ message: COULD_NOT_FIND_THE_USER }));
    }
    return;
  }

  if (request.method === "PATCH" && userPath !== null) {
    try {
      const id = decodeURIComponent(userPath[1]);
      request.setEncoding("utf8");
      let bodyText = "";
      for await (const chunk of request) {
        bodyText += chunk;
      }
      const body = JSON.parse(bodyText || "{}");
      const changes = {};
      if (body.name !== undefined) {
        changes.name = body.name;
      }
      if (body.email !== undefined) {
        changes.email = body.email;
      }
      const user = await updateUser(id, changes);
      response.statusCode = 200;
      response.setHeader("content-type", "application/json");
      response.end(JSON.stringify(user));
    } catch (error) {
      if (error instanceof Error) {
        const message = error.message;
        if (message === NAME_IS_EMPTY) {
          response.statusCode = 400;
          response.setHeader("content-type", "application/json");
          response.end(JSON.stringify({ message }));
          return;
        }
        if (message === EMAIL_IS_INVALID) {
          response.statusCode = 400;
          response.setHeader("content-type", "application/json");
          response.end(JSON.stringify({ message }));
          return;
        }
        if (message === EMAIL_IS_ALREADY_USED) {
          response.statusCode = 409;
          response.setHeader("content-type", "application/json");
          response.end(JSON.stringify({ message }));
          return;
        }
        if (message === USER_NOT_FOUND) {
          response.statusCode = 404;
          response.setHeader("content-type", "application/json");
          response.end(JSON.stringify({ message }));
          return;
        }
        if (message === COULD_NOT_UPDATE_THE_USER) {
          response.statusCode = 500;
          response.setHeader("content-type", "application/json");
          response.end(JSON.stringify({ message }));
          return;
        }
      }
      response.statusCode = 500;
      response.setHeader("content-type", "application/json");
      response.end(JSON.stringify({ message: COULD_NOT_UPDATE_THE_USER }));
    }
    return;
  }

  if (request.method === "DELETE" && userPath !== null) {
    try {
      const id = decodeURIComponent(userPath[1]);
      await deleteUser(id);
      response.statusCode = 204;
      response.end();
    } catch (error) {
      if (error instanceof Error) {
        const message = error.message;
        if (message === USER_NOT_FOUND) {
          response.statusCode = 404;
          response.setHeader("content-type", "application/json");
          response.end(JSON.stringify({ message }));
          return;
        }
        if (message === COULD_NOT_DELETE_THE_USER) {
          response.statusCode = 500;
          response.setHeader("content-type", "application/json");
          response.end(JSON.stringify({ message }));
          return;
        }
      }
      response.statusCode = 500;
      response.setHeader("content-type", "application/json");
      response.end(JSON.stringify({ message: COULD_NOT_DELETE_THE_USER }));
    }
    return;
  }

  response.statusCode = 404;
  response.end();
});

app.listen(port, hostname, () => {
  console.log(ORIGIN);
});
