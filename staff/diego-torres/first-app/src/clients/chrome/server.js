// Escribe avisos en la terminal.
import console from "node:console";
// Permite marcar que el programa ha terminado con un fallo.
import process from "node:process";
// Crea la API y sus rutas.
import Fastify from "fastify";

// Crea un usuario (viene de la capa de lógica).
import { createUser } from "../../logic/create-user.js";
// Borra un usuario (viene de la capa de lógica).
import { deleteUser } from "../../logic/delete-user.js";
// Busca un usuario por su id (viene de la capa de lógica).
import { findUserById } from "../../logic/find-user-by-id.js";
// Busca usuarios por su nombre (viene de la capa de lógica).
import { findUserByName } from "../../logic/find-user-by-name.js";
// Devuelve la lista de usuarios (viene de la capa de lógica).
import { listUsers } from "../../logic/list-users.js";
// Modifica un usuario (viene de la capa de lógica).
import { updateUser } from "../../logic/update-user.js";

// Dirección de esta API. Solo escucha en este ordenador.
const HOST = "127.0.0.1";
const PORT = 3002;

// Estado HTTP de cada error de las reglas. El resto es un fallo de conexión.
const ESTADOS = {
  "Name is empty": 400,
  "Email is invalid": 400,
  "Email is already used": 409,
  "User not found": 404,
};

// Responde a un fallo con su estado y el mensaje de la lógica.
function responderError(reply, error, mensajeDeFallo) {
  const estado = ESTADOS[error?.message];

  // Si no es un error de las reglas, se responde el fallo de esa acción.
  if (estado === undefined) {
    return reply.code(500).send({ message: mensajeDeFallo });
  }
  return reply.code(estado).send({ message: error.message });
}

const app = Fastify();

// Solo se acepta JSON. Fastify también admite text/plain si no se le quita.
app.removeContentTypeParser("text/plain");

// Antes de atender nada, comprueba quién hace la petición.
app.addHook("onRequest", async (request, reply) => {
  // Solo se responde a esta dirección. Protege del DNS rebinding.
  if (request.headers.host !== `${HOST}:${PORT}`) {
    return reply.code(403).send();
  }

  // Una web lleva su Origin y se rechaza. Sin Origin se atiende, como en src/db/server.js.
  const origen = request.headers.origin;
  if (origen !== undefined && !origen.startsWith("chrome-extension://")) {
    return reply.code(403).send();
  }
});

// Crea un usuario con el nombre y el email recibidos.
app.post("/users", async (request, reply) => {
  try {
    const { name, email } = request.body ?? {};
    const user = await createUser({ name, email });
    return reply.code(201).send(user);
  } catch (error) {
    return responderError(reply, error, "Could not create the user");
  }
});

// Devuelve todos los usuarios.
app.get("/users", async (request, reply) => {
  try {
    const users = await listUsers();
    return reply.code(200).send(users);
  } catch (error) {
    return responderError(reply, error, "Could not list the users");
  }
});

// Busca usuarios por el nombre que llega en la dirección.
// Va antes que /users/:id para que se lea igual que en la API de Nest.
app.get("/users/by-name", async (request, reply) => {
  try {
    const users = await findUserByName(request.query.name);
    return reply.code(200).send(users);
  } catch (error) {
    return responderError(reply, error, "Could not find the user");
  }
});

// Devuelve el usuario con ese id.
app.get("/users/:id", async (request, reply) => {
  try {
    const user = await findUserById(request.params.id);
    return reply.code(200).send(user);
  } catch (error) {
    return responderError(reply, error, "Could not find the user");
  }
});

// Modifica el usuario con ese id.
app.patch("/users/:id", async (request, reply) => {
  try {
    // Lo que no llega no entra en los cambios y conserva su valor.
    const { name, email } = request.body ?? {};
    const changes = {};
    if (name !== undefined) {
      changes.name = name;
    }
    if (email !== undefined) {
      changes.email = email;
    }

    const user = await updateUser(request.params.id, changes);
    return reply.code(200).send(user);
  } catch (error) {
    return responderError(reply, error, "Could not update the user");
  }
});

// Borra el usuario con ese id y responde sin cuerpo.
app.delete("/users/:id", async (request, reply) => {
  try {
    await deleteUser(request.params.id);
    return reply.code(204).send();
  } catch (error) {
    return responderError(reply, error, "Could not delete the user");
  }
});

// Cualquier otra ruta responde 404 sin cuerpo.
app.setNotFoundHandler((request, reply) => {
  return reply.code(404).send();
});

// Arranca la API y avisa si no ha podido hacerlo.
try {
  await app.listen({ port: PORT, host: HOST });
  console.log(`API de la extensión: http://${HOST}:${PORT}`);
} catch (motivo) {
  if (motivo.code === "EADDRINUSE") {
    console.error(
      `El puerto ${PORT} ya está ocupado. Cierra la otra API (Ctrl+C en su terminal) y vuelve a intentarlo.`,
    );
  } else {
    console.error(`No se ha podido iniciar la API en el puerto ${PORT}.`);
  }
  process.exitCode = 1;
}
