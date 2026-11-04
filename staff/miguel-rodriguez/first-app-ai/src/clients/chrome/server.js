import Fastify from "fastify";
import { createUser } from "../../logic/create-user.js";
import { listUsers } from "../../logic/list-users.js";
import { findUserById } from "../../logic/find-user-by-id.js";
import { updateUser } from "../../logic/update-user.js";
import { deleteUser } from "../../logic/delete-user.js";
import { usersGenderCount } from "../../logic/users-gender-count.js";

const HOST = "127.0.0.1";
const PORT = 3002;
const app = Fastify();

function replyWithError(reply, error, fallback) {
  const message = error.message;
  const statusByMessage = {
    "Name is empty": 400,
    "Email is invalid": 400,
    "Email is already used": 409,
    "User not found": 404,
  };
  const knownStatus = statusByMessage[message];
  if (knownStatus) {
    reply.code(knownStatus);
    return { message };
  }
  reply.code(500);
  return { message: fallback };
}

app.post("/users", async (request, reply) => {
  try {
    const body = request.body;
    const name = body.name;
    const email = body.email;
    const user = await createUser({ name, email });
    reply.code(201);
    return user;
  } catch (error) {
    return replyWithError(reply, error, "Could not create the user");
  }
});

app.get("/users", async (request, reply) => {
  try {
    return await listUsers();
  } catch (error) {
    return replyWithError(reply, error, "Could not list the users");
  }
});

app.get("/users/gender-count", async (request, reply) => {
  try {
    return await usersGenderCount();
  } catch (error) {
    return replyWithError(reply, error, "Could not classify the users");
  }
});

app.get("/users/:id", async (request, reply) => {
  try {
    const idText = request.params.id;
    const id = Number(idText);
    return await findUserById(id);
  } catch (error) {
    return replyWithError(reply, error, "Could not find the user");
  }
});

app.patch("/users/:id", async (request, reply) => {
  try {
    const idText = request.params.id;
    const id = Number(idText);
    const body = request.body;
    const name = body.name;
    const email = body.email;
    const user = await updateUser(id, { name, email });
    return user;
  } catch (error) {
    return replyWithError(reply, error, "Could not update the user");
  }
});

app.delete("/users/:id", async (request, reply) => {
  try {
    const idText = request.params.id;
    const id = Number(idText);
    await deleteUser(id);
    reply.code(204);
    return reply.send();
  } catch (error) {
    return replyWithError(reply, error, "Could not delete the user");
  }
});

try {
  const address = await app.listen({ host: HOST, port: PORT });
  console.log(address);
} catch (error) {
  console.error(error.message);
  process.exitCode = 1;
}
