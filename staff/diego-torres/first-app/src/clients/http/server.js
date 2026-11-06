// Escribe avisos en la terminal.
import console from "node:console";
// Permite marcar que el programa ha terminado con un fallo.
import process from "node:process";
// Crea la API y sus rutas.
import express from "express";

// Crea un usuario (viene de la capa de lógica).
import { createUser } from "../../logic/create-user.js";
// Borra un usuario (viene de la capa de lógica).
import { deleteUser } from "../../logic/delete-user.js";
// Busca un usuario por su email (viene de la capa de lógica).
import { findUserByEmail } from "../../logic/find-user-by-email.js";
// Busca un usuario por su id (viene de la capa de lógica).
import { findUserById } from "../../logic/find-user-by-id.js";
// Busca usuarios por su nombre (viene de la capa de lógica).
import { findUserByName } from "../../logic/find-user-by-name.js";
// Devuelve la lista de usuarios (viene de la capa de lógica).
import { listUsers } from "../../logic/list-users.js";
// Modifica un usuario (viene de la capa de lógica).
import { updateUser } from "../../logic/update-user.js";
// Cuenta los usuarios por género (viene de la capa de lógica).
import { usersGenderCount } from "../../logic/users-gender-count.js";

// Dirección de esta API. Solo escucha en este ordenador.
const HOST = "127.0.0.1";
const PORT = 3001;

// Estado HTTP de cada error de las reglas. El resto es un fallo de conexión.
const ESTADOS = {
  "Name is empty": 400,
  "Email is invalid": 400,
  "Email is already used": 409,
  "User not found": 404,
};

// Responde a un fallo con su estado y el mensaje de la lógica.
function responderError(response, error, mensajeDeFallo) {
  const estado = ESTADOS[error?.message];

  // Si no es un error de las reglas, se responde el fallo de esa acción.
  if (estado === undefined) {
    return response.status(500).json({ message: mensajeDeFallo });
  }
  return response.status(estado).json({ message: error.message });
}

// Antes de atender nada, comprueba quién hace la petición.
function comprobarPeticion(request, response, next) {
  // Solo se responde a esta dirección. Protege del DNS rebinding.
  if (request.headers.host !== `${HOST}:${PORT}`) {
    return response.status(403).end();
  }

  // Una web lleva su Origin y se rechaza. Esta API no tiene página propia.
  if (request.headers.origin !== undefined) {
    return response.status(403).end();
  }

  next();
}

const app = express();

app.use(comprobarPeticion);

// Convierte en datos el cuerpo que llega en JSON.
app.use(express.json());

// Crea un usuario con el nombre y el email recibidos.
app.post("/users", async (request, response) => {
  try {
    const { name, email } = request.body ?? {};
    const user = await createUser({ name, email });
    return response.status(201).json(user);
  } catch (error) {
    return responderError(response, error, "Could not create the user");
  }
});

// Devuelve todos los usuarios.
app.get("/users", async (request, response) => {
  try {
    const users = await listUsers();
    return response.status(200).json(users);
  } catch (error) {
    return responderError(response, error, "Could not list the users");
  }
});

// Busca un usuario por el email que llega en la dirección.
// Va antes que /users/:id. Si no, "by-email" se tomaría por un id.
app.get("/users/by-email", async (request, response) => {
  try {
    const user = await findUserByEmail(request.query.email);
    return response.status(200).json(user);
  } catch (error) {
    return responderError(response, error, "Could not find the user");
  }
});

// Busca usuarios por el nombre que llega en la dirección.
// Va antes que /users/:id. Si no, "by-name" se tomaría por un id.
app.get("/users/by-name", async (request, response) => {
  try {
    const users = await findUserByName(request.query.name);
    return response.status(200).json(users);
  } catch (error) {
    return responderError(response, error, "Could not find the user");
  }
});

// Cuenta los usuarios por el género de su nombre.
// Va antes que /users/:id. Si no, "gender-count" se tomaría por un id.
app.get("/users/gender-count", async (request, response) => {
  try {
    const counts = await usersGenderCount();
    return response.status(200).json(counts);
  } catch (error) {
    return responderError(response, error, "Could not classify the users");
  }
});

// Devuelve el usuario con ese id.
app.get("/users/:id", async (request, response) => {
  try {
    const user = await findUserById(request.params.id);
    return response.status(200).json(user);
  } catch (error) {
    return responderError(response, error, "Could not find the user");
  }
});

// Modifica el usuario con ese id.
app.patch("/users/:id", async (request, response) => {
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
    return response.status(200).json(user);
  } catch (error) {
    return responderError(response, error, "Could not update the user");
  }
});

// Borra el usuario con ese id y responde sin cuerpo.
app.delete("/users/:id", async (request, response) => {
  try {
    await deleteUser(request.params.id);
    return response.status(204).end();
  } catch (error) {
    return responderError(response, error, "Could not delete the user");
  }
});

// Cualquier otra ruta responde 404 sin cuerpo.
app.use((request, response) => {
  return response.status(404).end();
});

// Atiende lo que falla antes de llegar a una ruta. Express lo reconoce
// porque recibe cuatro datos.
app.use((error, request, response, next) => {
  // Si la respuesta ya ha empezado, Express se encarga de cortarla.
  if (response.headersSent) {
    return next(error);
  }

  // Un JSON mal escrito es culpa de la petición.
  if (error.type === "entity.parse.failed") {
    return response.status(400).end();
  }
  return response.status(500).end();
});

// Arranca la API.
const servidor = app.listen(PORT, HOST);

// Avisa cuando la API ya está lista.
servidor.on("listening", () => {
  console.log(`API de Express: http://${HOST}:${PORT}`);
});

// Avisa si no ha podido arrancar.
servidor.on("error", (motivo) => {
  if (motivo.code === "EADDRINUSE") {
    console.error(
      `El puerto ${PORT} ya está ocupado. Cierra la otra API (Ctrl+C en su terminal) y vuelve a intentarlo.`,
    );
  } else {
    console.error(`No se ha podido iniciar la API en el puerto ${PORT}.`);
  }
  process.exitCode = 1;
});
