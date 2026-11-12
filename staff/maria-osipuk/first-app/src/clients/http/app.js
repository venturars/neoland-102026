import { error as logError, log } from "node:console";

import express from "express";

import { countUsersByGender } from "../../logic/count-users-by-gender.js";
import { createUser } from "../../logic/create-user.js";
import { deleteUser } from "../../logic/delete-user.js";
import { findUserById } from "../../logic/find-user-by-id.js";
import { listUsers } from "../../logic/list-users.js";
import { updateUser } from "../../logic/update-user.js";

// This client only turns HTTP into calls to logic/ and back. The rules
// stay in logic/ and the SQL stays in the data server (pnpm start).
const HOSTNAME = "127.0.0.1";
const PORT = 3001;

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

// This message is born here, not in logic/: the terminal and Jupyter keep
// the logic messages. Any failure of the count that is not a failed read
// of the users answers this sentence.
const COULD_NOT_CLASSIFY = "Could not classify the users.";

// This message is born here: a broken body fails before reaching logic/.
const REQUEST_JSON_IS_INVALID = "Request JSON is invalid";

const app = express();
const readJson = express.json();
app.use(readJson);

app.post("/users", async (request, response) => {
  try {
    // Without a JSON body Express 5 leaves body undefined. An empty
    // object lets logic/ answer that the name is missing.
    let body = request.body;

    if (body === undefined) {
      body = {};
    }

    const name = body.name;
    const email = body.email;
    const user = await createUser(name, email);
    response.status(201);
    response.json(user);
  } catch (error) {
    if (error instanceof Error) {
      const message = error.message;

      if (message === NAME_IS_REQUIRED) {
        response.status(400);
        response.json({ message });
        return;
      }

      if (message === EMAIL_IS_INVALID) {
        response.status(400);
        response.json({ message });
        return;
      }

      if (message === EMAIL_IS_REGISTERED) {
        response.status(409);
        response.json({ message });
        return;
      }
    }

    // Anything else answers the message of this operation, so an
    // unknown text never reaches the person who made the request.
    response.status(500);
    response.json({ message: UNABLE_TO_CREATE });
  }
});

app.get("/users", async (request, response) => {
  try {
    const users = await listUsers();
    response.status(200);
    response.json(users);
  } catch {
    response.status(500);
    response.json({ message: UNABLE_TO_LIST });
  }
});

// This route is before /users/:id so "gender-count" is not read as an id.
app.get("/users/gender-count", async (request, response) => {
  try {
    const counts = await countUsersByGender();
    response.status(200);
    response.json(counts);
  } catch (error) {
    if (error instanceof Error) {
      const message = error.message;

      if (message === UNABLE_TO_LIST) {
        response.status(500);
        response.json({ message });
        return;
      }
    }

    response.status(500);
    response.json({ message: COULD_NOT_CLASSIFY });
  }
});

app.get("/users/:id", async (request, response) => {
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
    response.status(200);
    response.json(user);
  } catch (error) {
    if (error instanceof Error) {
      const message = error.message;

      if (message === ID_IS_INVALID) {
        response.status(400);
        response.json({ message });
        return;
      }

      if (message === USER_DOES_NOT_EXIST) {
        response.status(404);
        response.json({ message });
        return;
      }
    }

    response.status(500);
    response.json({ message: UNABLE_TO_FIND });
  }
});

app.patch("/users/:id", async (request, response) => {
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
    response.status(200);
    response.json(user);
  } catch (error) {
    if (error instanceof Error) {
      const message = error.message;

      if (message === ID_IS_INVALID) {
        response.status(400);
        response.json({ message });
        return;
      }

      if (message === NAME_IS_REQUIRED) {
        response.status(400);
        response.json({ message });
        return;
      }

      if (message === EMAIL_IS_INVALID) {
        response.status(400);
        response.json({ message });
        return;
      }

      if (message === EMAIL_IS_REGISTERED) {
        response.status(409);
        response.json({ message });
        return;
      }

      if (message === USER_DOES_NOT_EXIST) {
        response.status(404);
        response.json({ message });
        return;
      }
    }

    response.status(500);
    response.json({ message: UNABLE_TO_UPDATE });
  }
});

app.delete("/users/:id", async (request, response) => {
  try {
    const idText = request.params.id;
    const idNumber = Number(idText);
    const idNumberText = String(idNumber);
    let id = idText;

    if (idNumberText === idText) {
      id = idNumber;
    }

    await deleteUser(id);
    response.status(204);
    response.end();
  } catch (error) {
    if (error instanceof Error) {
      const message = error.message;

      if (message === ID_IS_INVALID) {
        response.status(400);
        response.json({ message });
        return;
      }

      if (message === USER_DOES_NOT_EXIST) {
        response.status(404);
        response.json({ message });
        return;
      }

      // deleteUser looks for the user first, so without the data server
      // this is the message that arrives, not the one about deleting.
      if (message === UNABLE_TO_FIND) {
        response.status(500);
        response.json({ message });
        return;
      }
    }

    response.status(500);
    response.json({ message: UNABLE_TO_DELETE });
  }
});

app.use((request, response) => {
  response.status(404);
  response.end();
});

// Express knows this is the error step because it has four arguments.
// Each route catches its own errors, so only a body that could not be
// read arrives here. Without this step Express answers an HTML page
// with the stack trace, which shows internal details.
app.use((error, request, response, next) => {
  if (response.headersSent) {
    next(error);
    return;
  }

  response.status(400);
  response.json({ message: REQUEST_JSON_IS_INVALID });
});

// Listen only on this computer, like the data server.
app.listen(PORT, HOSTNAME, (error) => {
  if (error) {
    logError(
      "No se ha podido iniciar el cliente REST. Comprueba si el puerto 3001 está ocupado.",
    );
    process.exitCode = 1;
    return;
  }

  log("First App REST client: http://" + HOSTNAME + ":" + PORT);
});
