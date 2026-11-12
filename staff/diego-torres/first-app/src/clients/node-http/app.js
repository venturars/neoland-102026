// Permite juntar los trozos del cuerpo de una petición.
import { Buffer } from "node:buffer";
// Escribe avisos en la terminal.
import console from "node:console";
// Crea el servidor web que ya trae Node.
import { createServer } from "node:http";
// Permite marcar que el programa ha terminado con un fallo.
import process from "node:process";
// Separa una dirección en su ruta y sus parámetros.
import { URL } from "node:url";

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
const PORT = 3004;

// Tamaño máximo del cuerpo de una petición: 100 KB, igual que en Express.
const LIMITE_CUERPO = 100 * 1024;

// Estado HTTP de cada error de las reglas. El resto es un fallo de conexión.
const ESTADOS = {
  "Name is empty": 400,
  "Email is invalid": 400,
  "Email is already used": 409,
  "User not found": 404,
};

// Responde con un estado y unos datos en JSON.
function responderJson(response, estado, datos) {
  response.writeHead(estado, {
    "content-type": "application/json; charset=utf-8",
  });
  response.end(JSON.stringify(datos));
}

// Responde solo con un estado, sin cuerpo.
function responderVacio(response, estado) {
  response.writeHead(estado);
  response.end();
}

// Responde a un fallo con su estado y el mensaje de la lógica.
function responderError(response, error, mensajeDeFallo) {
  const estado = ESTADOS[error?.message];

  // Si no es un error de las reglas, se responde el fallo de esa acción.
  if (estado === undefined) {
    return responderJson(response, 500, { message: mensajeDeFallo });
  }
  return responderJson(response, estado, { message: error.message });
}

// Comprueba quién hace la petición.
function esPeticionPermitida(request) {
  // Solo se responde si la petición va a esta dirección exacta.
  // Así, una web con otra dirección no puede hablar con esta API.
  if (request.headers.host !== `${HOST}:${PORT}`) {
    return false;
  }

  // Una web lleva su Origin y se rechaza. Esta API no tiene página propia.
  return request.headers.origin === undefined;
}

// Junta los trozos del cuerpo. Si pasa del límite, devuelve null.
async function leerCuerpo(request) {
  const trozos = [];
  let tamano = 0;

  // Los trozos llegan poco a poco. Hay que leerlos todos para poder responder.
  for await (const trozo of request) {
    tamano += trozo.length;
    if (tamano <= LIMITE_CUERPO) {
      trozos.push(trozo);
    }
  }

  if (tamano > LIMITE_CUERPO) {
    return null;
  }
  return Buffer.concat(trozos).toString("utf8");
}

// Convierte el texto del cuerpo en datos. Si no vale, devuelve null.
function convertirCuerpo(request, texto) {
  const cabecera = request.headers["content-type"] ?? "";
  const tipo = cabecera.split(";")[0].trim().toLowerCase();

  // Sin cuerpo, o si no dice que es JSON, se sigue sin datos.
  if (texto === "" || tipo !== "application/json") {
    return {};
  }

  // Un JSON mal escrito es culpa de la petición.
  let datos;
  try {
    datos = JSON.parse(texto);
  } catch {
    return null;
  }

  // Solo valen objetos y listas. Un valor suelto, como "hola", no vale.
  if (typeof datos !== "object" || datos === null) {
    return null;
  }
  return datos;
}

// Saca el id de /users/:id. Si la ruta no tiene esa forma, devuelve null.
function sacarId(ruta) {
  // "/users/7" se parte en "", "users" y "7".
  const partes = ruta.split("/");
  if (partes.length !== 3 || partes[1] !== "users") {
    return null;
  }

  // Si el id está mal codificado, esta línea lanza un URIError.
  return decodeURIComponent(partes[2]);
}

// Lanza una acción y responde con sus datos o con su fallo.
async function responderAccion(response, estado, mensajeDeFallo, accion) {
  try {
    const datos = await accion();
    return responderJson(response, estado, datos);
  } catch (error) {
    return responderError(response, error, mensajeDeFallo);
  }
}

// Modifica un usuario con lo que llega en el cuerpo.
function modificarUsuario(id, cuerpo) {
  // Lo que no llega no entra en los cambios y conserva su valor.
  const { name, email } = cuerpo;
  const changes = {};
  if (name !== undefined) {
    changes.name = name;
  }
  if (email !== undefined) {
    changes.email = email;
  }

  return updateUser(id, changes);
}

// Borra un usuario y responde sin cuerpo.
async function borrarUsuario(response, id) {
  try {
    await deleteUser(id);
    return responderVacio(response, 204);
  } catch (error) {
    return responderError(response, error, "Could not delete the user");
  }
}

// Elige qué hacer según el método y la ruta de la petición.
function atenderRuta(request, response, cuerpo) {
  const { method } = request;
  const direccion = new URL(request.url, `http://${HOST}:${PORT}`);
  const parametros = direccion.searchParams;

  // La barra del final no cambia la ruta: /users/ es lo mismo que /users.
  const ruta = direccion.pathname.replace(/\/$/, "");

  // Crea un usuario con el nombre y el email recibidos.
  if (method === "POST" && ruta === "/users") {
    const { name, email } = cuerpo;
    return responderAccion(response, 201, "Could not create the user", () =>
      createUser({ name, email }),
    );
  }

  // Devuelve todos los usuarios.
  if (method === "GET" && ruta === "/users") {
    return responderAccion(
      response,
      200,
      "Could not list the users",
      listUsers,
    );
  }

  // Busca un usuario por el email que llega en la dirección.
  // Va antes que /users/:id. Si no, "by-email" se tomaría por un id.
  if (method === "GET" && ruta === "/users/by-email") {
    // Si falta el email, la lógica recibe undefined, igual que con Express.
    const email = parametros.get("email") ?? undefined;
    return responderAccion(response, 200, "Could not find the user", () =>
      findUserByEmail(email),
    );
  }

  // Busca usuarios por el nombre que llega en la dirección.
  // Va antes que /users/:id. Si no, "by-name" se tomaría por un id.
  if (method === "GET" && ruta === "/users/by-name") {
    // Si falta el nombre, la lógica recibe undefined, igual que con Express.
    const name = parametros.get("name") ?? undefined;
    return responderAccion(response, 200, "Could not find the user", () =>
      findUserByName(name),
    );
  }

  // Cuenta los usuarios por el género de su nombre.
  // Va antes que /users/:id. Si no, "gender-count" se tomaría por un id.
  if (method === "GET" && ruta === "/users/gender-count") {
    return responderAccion(
      response,
      200,
      "Could not classify the users",
      usersGenderCount,
    );
  }

  const id = sacarId(ruta);

  // Devuelve el usuario con ese id.
  if (method === "GET" && id !== null) {
    return responderAccion(response, 200, "Could not find the user", () =>
      findUserById(id),
    );
  }

  // Modifica el usuario con ese id.
  if (method === "PATCH" && id !== null) {
    return responderAccion(response, 200, "Could not update the user", () =>
      modificarUsuario(id, cuerpo),
    );
  }

  // Borra el usuario con ese id.
  if (method === "DELETE" && id !== null) {
    return borrarUsuario(response, id);
  }

  // Cualquier otra ruta responde 404 sin cuerpo.
  return responderVacio(response, 404);
}

// Atiende cada petición, de principio a fin.
async function atenderPeticion(request, response) {
  try {
    // Antes de atender nada, comprueba quién hace la petición.
    if (!esPeticionPermitida(request)) {
      return responderVacio(response, 403);
    }

    // Un cuerpo demasiado grande responde 500, igual que con Express.
    const texto = await leerCuerpo(request);
    if (texto === null) {
      return responderVacio(response, 500);
    }

    // Un cuerpo que no vale es culpa de la petición.
    const cuerpo = convertirCuerpo(request, texto);
    if (cuerpo === null) {
      return responderVacio(response, 400);
    }

    return await atenderRuta(request, response, cuerpo);
  } catch (error) {
    // Si la respuesta ya ha empezado, solo se puede cortar.
    if (response.headersSent) {
      return response.destroy();
    }

    // Un id mal codificado es culpa de la petición.
    if (error instanceof URIError) {
      return responderVacio(response, 400);
    }
    return responderVacio(response, 500);
  }
}

// Crea la API.
const servidor = createServer(atenderPeticion);

// Avisa cuando la API ya está lista.
servidor.on("listening", () => {
  console.log(`API de Node: http://${HOST}:${PORT}`);
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

// Arranca la API.
servidor.listen(PORT, HOST);
