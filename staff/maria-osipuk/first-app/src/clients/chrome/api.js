import { error as logError, log } from "node:console";

import Fastify from "fastify";

import { countUsersByGender } from "../../logic/count-users-by-gender.js";
import { createUser } from "../../logic/create-user.js";
import { deleteUser } from "../../logic/delete-user.js";
import { findUserById } from "../../logic/find-user-by-id.js";
import { listUsers } from "../../logic/list-users.js";
import { updateUser } from "../../logic/update-user.js";

// A Chrome extension only sees the files of its own folder, so it cannot
// import logic/. This small API runs in Node, imports logic/ for the
// extension and only turns HTTP into calls and back. The rules stay in
// logic/ and the SQL stays in the data server (pnpm start).
const HOSTNAME = "127.0.0.1";
const PORT = 3002;

// The messages thrown by logic/. The extension shows them in English,
// as they are, so this file only decides the HTTP status of each one.
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

// This message is born here, not in logic/: the terminal and Jupyter keep
// the logic messages. Any failure of the count that is not a failed read
// of the users answers this sentence.
const COULD_NOT_CLASSIFY = "Could not classify the users.";

// This message is born here: a broken body fails before reaching logic/.
const REQUEST_JSON_IS_INVALID = "Request JSON is invalid";

// There are no CORS headers on purpose. A web page open in Chrome is blocked
// by the browser, and only the extension can call this API, because its
// manifest.json declares this address in host_permissions.
const app = Fastify();

// Each route catches its own errors, so only a request that could not be
// read arrives here. Without this step the answer would be the technical
// text of Fastify.
app.setErrorHandler((error, request, reply) => {
  reply.code(400);
  reply.send({ message: REQUEST_JSON_IS_INVALID });
});

// Without this step an unknown route answers JSON with the text of Fastify.
app.setNotFoundHandler((request, reply) => {
  reply.code(404);
  reply.send();
});

app.post("/users", async (request, reply) => {
  try {
    // Without a body Fastify leaves it undefined, and the JSON text null
    // leaves it null. An empty object lets logic/ answer that the name is
    // missing, instead of a TypeError when reading body.name.
    let body = request.body;

    if (body === undefined) {
      body = {};
    }

    if (body === null) {
      body = {};
    }

    const name = body.name;
    const email = body.email;
    const user = await createUser(name, email);
    reply.code(201);
    return user;
  } catch (error) {
    if (error instanceof Error) {
      const message = error.message;

      if (message === NAME_IS_REQUIRED) {
        reply.code(400);
        return { message };
      }

      if (message === EMAIL_IS_INVALID) {
        reply.code(400);
        return { message };
      }

      if (message === EMAIL_IS_REGISTERED) {
        reply.code(409);
        return { message };
      }
    }

    // Anything else answers the message of this operation, so an
    // unknown text never reaches the person using the extension.
    reply.code(500);
    return { message: UNABLE_TO_CREATE };
  }
});

app.get("/users", async (request, reply) => {
  try {
    const users = await listUsers();
    return users;
  } catch {
    reply.code(500);
    return { message: UNABLE_TO_LIST };
  }
});

// This route is before /users/:id so "gender-count" is not read as an id.
app.get("/users/gender-count", async (request, reply) => {
  try {
    const counts = await countUsersByGender();
    return counts;
  } catch (error) {
    if (error instanceof Error) {
      const message = error.message;

      if (message === UNABLE_TO_LIST) {
        reply.code(500);
        return { message };
      }
    }

    reply.code(500);
    return { message: COULD_NOT_CLASSIFY };
  }
});

app.get("/users/:id", async (request, reply) => {
  try {
    // The route gives text and logic/ needs a number. The number is used
    // only if it writes back the same text: "1e3" would silently become
    // 1000, so it stays as text and logic/ rejects it.
    const idText = request.params.id;
    const idNumber = Number(idText);
    const idNumberText = String(idNumber);
    let id = idText;

    if (idNumberText === idText) {
      id = idNumber;
    }

    const user = await findUserById(id);
    return user;
  } catch (error) {
    if (error instanceof Error) {
      const message = error.message;

      if (message === ID_IS_INVALID) {
        reply.code(400);
        return { message };
      }

      if (message === USER_DOES_NOT_EXIST) {
        reply.code(404);
        return { message };
      }
    }

    reply.code(500);
    return { message: UNABLE_TO_FIND };
  }
});

app.patch("/users/:id", async (request, reply) => {
  try {
    const idText = request.params.id;
    const idNumber = Number(idText);
    const idNumberText = String(idNumber);
    let id = idText;

    if (idNumberText === idText) {
      id = idNumber;
    }

    let body = request.body;

    if (body === undefined) {
      body = {};
    }

    if (body === null) {
      body = {};
    }

    // updateUser looks at which keys exist, so a field that was not sent
    // must not be in changes: that is how it keeps the stored value.
    const changes = {};

    if (body.name !== undefined) {
      changes.name = body.name;
    }

    if (body.email !== undefined) {
      changes.email = body.email;
    }

    const user = await updateUser(id, changes);
    return user;
  } catch (error) {
    if (error instanceof Error) {
      const message = error.message;

      if (message === ID_IS_INVALID) {
        reply.code(400);
        return { message };
      }

      if (message === NAME_IS_REQUIRED) {
        reply.code(400);
        return { message };
      }

      if (message === EMAIL_IS_INVALID) {
        reply.code(400);
        return { message };
      }

      if (message === EMAIL_IS_REGISTERED) {
        reply.code(409);
        return { message };
      }

      if (message === USER_DOES_NOT_EXIST) {
        reply.code(404);
        return { message };
      }
    }

    // updateUser looks for the user first, so without the data server
    // "Unable to find user" arrives here. It is not on the list above,
    // so the person sees the message of the action they asked for.
    reply.code(500);
    return { message: UNABLE_TO_UPDATE };
  }
});

app.delete("/users/:id", async (request, reply) => {
  try {
    const idText = request.params.id;
    const idNumber = Number(idText);
    const idNumberText = String(idNumber);
    let id = idText;

    if (idNumberText === idText) {
      id = idNumber;
    }

    await deleteUser(id);
    reply.code(204);
    reply.send();
    return reply;
  } catch (error) {
    if (error instanceof Error) {
      const message = error.message;

      if (message === ID_IS_INVALID) {
        reply.code(400);
        return { message };
      }

      if (message === USER_DOES_NOT_EXIST) {
        reply.code(404);
        return { message };
      }
    }

    // deleteUser also looks for the user first, so the same rule as in
    // the route above applies: the message is the one about deleting.
    reply.code(500);
    return { message: UNABLE_TO_DELETE };
  }
});

// Listen only on this computer, like the data server.
try {
  await app.listen({ port: PORT, host: HOSTNAME });
  log("First App Chrome API: http://" + HOSTNAME + ":" + PORT);
} catch {
  logError(
    "No se ha podido iniciar la API de Chrome. Comprueba si el puerto 3002 está ocupado.",
  );
  process.exitCode = 1;
}
