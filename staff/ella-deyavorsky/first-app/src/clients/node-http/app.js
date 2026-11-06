/* global console */
import { createServer } from "node:http";
import { createUser } from "../../logic/create-user.js";
import { listUsers } from "../../logic/list-users.js";
import { findUserById } from "../../logic/find-user-by-id.js";
import { updateUser } from "../../logic/update-user.js";
import { deleteUser } from "../../logic/delete-user.js";

// The client listens only on this computer, so nobody else on the network can reach it.
const HOST = "127.0.0.1";
// The database program uses 3000, Express 3001, Chrome 3002 and Nest 3003, so this client uses 3004.
const PORT = 3004;

const server = createServer(async (request, response) => {
  // The path is the part of the address before "?", without one final "/".
  const address = request.url.split("?")[0];
  let path = address;
  if (path.length > 1 && path.endsWith("/")) {
    path = path.slice(0, -1);
  }
  const parts = path.split("/");
  // "/users" gives ["", "users"] and "/users/7" gives ["", "users", "7"].
  const isUsers = parts.length === 2 && parts[1] === "users";
  const isUser = parts.length === 3 && parts[1] === "users" && parts[2] !== "";
  const method = request.method;

  // Reads the body as text. Only POST and PATCH need it parsed.
  let body = undefined;
  if (method === "POST" || method === "PATCH") {
    request.setEncoding("utf8");
    let text = "";
    // The read can fail if the client disconnects. It is in the same try as the parse,
    // so the server keeps running and the request is answered as not valid.
    try {
      for await (const chunk of request) {
        text = text + chunk;
      }
      body = JSON.parse(text);
    } catch {
      body = undefined;
    }
  }

  if (isUsers && method === "POST") {
    // The route checks the shape of the input. The rules stay in logic/.
    if (body === undefined || body === null || typeof body !== "object") {
      response.writeHead(400, { "Content-Type": "application/json" });
      response.end(JSON.stringify({ error: "The request is not valid." }));
      return;
    }

    const name = body.name;
    const email = body.email;
    if (typeof name !== "string" || typeof email !== "string") {
      response.writeHead(400, { "Content-Type": "application/json" });
      response.end(JSON.stringify({ error: "The request is not valid." }));
      return;
    }

    try {
      const user = await createUser({ name, email });
      response.writeHead(201, { "Content-Type": "application/json" });
      response.end(JSON.stringify(user));
    } catch (error) {
      if (
        error.message === "The name is missing." ||
        error.message === "The email is not valid."
      ) {
        response.writeHead(400, { "Content-Type": "application/json" });
        response.end(JSON.stringify({ error: error.message }));
        return;
      }
      if (error.message === "This email is already used.") {
        response.writeHead(409, { "Content-Type": "application/json" });
        response.end(JSON.stringify({ error: error.message }));
        return;
      }
      if (error.message !== "The database failed.") {
        // Not a sentence of the app: a real bug, so it is shown in the terminal.
        console.error(error);
      }
      response.writeHead(500, { "Content-Type": "application/json" });
      response.end(JSON.stringify({ error: "The database failed." }));
    }
    return;
  }

  if (isUsers && method === "GET") {
    try {
      const users = await listUsers();
      response.writeHead(200, { "Content-Type": "application/json" });
      response.end(JSON.stringify(users));
    } catch (error) {
      if (error.message !== "The database failed.") {
        console.error(error);
      }
      response.writeHead(500, { "Content-Type": "application/json" });
      response.end(JSON.stringify({ error: "The database failed." }));
    }
    return;
  }

  if (isUser && method === "GET") {
    // The id comes from the path as text. Text that is not a number matches no user.
    const id = Number(parts[2]);

    try {
      const user = await findUserById({ id });
      response.writeHead(200, { "Content-Type": "application/json" });
      response.end(JSON.stringify(user));
    } catch (error) {
      if (error.message === "No user was found.") {
        response.writeHead(404, { "Content-Type": "application/json" });
        response.end(JSON.stringify({ error: error.message }));
        return;
      }
      if (error.message !== "The database failed.") {
        console.error(error);
      }
      response.writeHead(500, { "Content-Type": "application/json" });
      response.end(JSON.stringify({ error: "The database failed." }));
    }
    return;
  }

  if (isUser && method === "PATCH") {
    const id = Number(parts[2]);

    if (body === undefined || body === null || typeof body !== "object") {
      response.writeHead(400, { "Content-Type": "application/json" });
      response.end(JSON.stringify({ error: "The request is not valid." }));
      return;
    }

    // A field that is not sent stays undefined, so logic/ keeps the old value.
    const name = body.name;
    const email = body.email;
    if (name !== undefined && typeof name !== "string") {
      response.writeHead(400, { "Content-Type": "application/json" });
      response.end(JSON.stringify({ error: "The request is not valid." }));
      return;
    }
    if (email !== undefined && typeof email !== "string") {
      response.writeHead(400, { "Content-Type": "application/json" });
      response.end(JSON.stringify({ error: "The request is not valid." }));
      return;
    }

    try {
      const user = await updateUser({ id, name, email });
      response.writeHead(200, { "Content-Type": "application/json" });
      response.end(JSON.stringify(user));
    } catch (error) {
      if (
        error.message === "There is nothing to update." ||
        error.message === "The name is missing." ||
        error.message === "The email is not valid."
      ) {
        response.writeHead(400, { "Content-Type": "application/json" });
        response.end(JSON.stringify({ error: error.message }));
        return;
      }
      if (error.message === "No user was found.") {
        response.writeHead(404, { "Content-Type": "application/json" });
        response.end(JSON.stringify({ error: error.message }));
        return;
      }
      if (error.message === "This email is already used.") {
        response.writeHead(409, { "Content-Type": "application/json" });
        response.end(JSON.stringify({ error: error.message }));
        return;
      }
      if (error.message !== "The database failed.") {
        console.error(error);
      }
      response.writeHead(500, { "Content-Type": "application/json" });
      response.end(JSON.stringify({ error: "The database failed." }));
    }
    return;
  }

  if (isUser && method === "DELETE") {
    const id = Number(parts[2]);

    try {
      await deleteUser({ id });
      response.writeHead(204);
      response.end();
    } catch (error) {
      if (error.message === "No user was found.") {
        response.writeHead(404, { "Content-Type": "application/json" });
        response.end(JSON.stringify({ error: error.message }));
        return;
      }
      if (error.message !== "The database failed.") {
        console.error(error);
      }
      response.writeHead(500, { "Content-Type": "application/json" });
      response.end(JSON.stringify({ error: "The database failed." }));
    }
    return;
  }

  // Any other path or method.
  response.writeHead(404, { "Content-Type": "application/json" });
  response.end(JSON.stringify({ error: "The request is not valid." }));
});

server.listen(PORT, HOST, () => {
  console.log("HTTP client on http://" + HOST + ":" + PORT);
});
