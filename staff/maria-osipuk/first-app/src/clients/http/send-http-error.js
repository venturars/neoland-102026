import { sendJson } from "./send-json.js";

const HTTP_ERRORS = {
  "User id must be a positive integer": [
    400,
    "El identificador debe ser un número entero mayor que cero.",
  ],
  "User name is required": [400, "Introduce un nombre."],
  "User email is invalid": [
    400,
    "Introduce un email válido de hasta 64 caracteres.",
  ],
  "User email is already registered": [
    409,
    "Ya existe un usuario con ese email.",
  ],
  "User changes must be an object": [
    400,
    "Revisa los datos que quieres modificar.",
  ],
  "User does not exist": [
    404,
    "No se ha encontrado ese usuario. Vuelve a la selección y actualiza la lista.",
  ],
  "Unable to find user": [500, "No se ha podido obtener el usuario."],
  "Unable to list users": [
    500,
    "No se ha podido obtener la lista de usuarios.",
  ],
  "Unable to update user": [500, "No se ha podido guardar el usuario."],
  "Unable to delete user": [500, "No se ha podido eliminar el usuario."],
  "Request must contain JSON": [400, "Envía los datos en formato JSON."],
  "Request JSON is invalid": [400, "No se han podido leer los datos enviados."],
  "Request JSON must be an object": [
    400,
    "Envía un objeto con los datos que quieres modificar.",
  ],
  "Request body is too large": [
    413,
    "Los datos enviados son demasiado grandes.",
  ],
  "HTTP resource does not exist": [404, "No se ha encontrado ese recurso."],
  "HTTP method is not allowed": [405, "Esta operación no está disponible."],
};

export function sendHttpError(response, error) {
  let statusCode = 500;
  let message = "No se ha podido completar la operación.";

  // Translate only known messages. Internal paths and SQLite details stay hidden.
  if (error instanceof Error) {
    const knownMessage = Object.hasOwn(HTTP_ERRORS, error.message);

    if (knownMessage) {
      const problem = HTTP_ERRORS[error.message];
      statusCode = problem[0];
      message = problem[1];
    }
  }

  sendJson(response, statusCode, { error: message });
}
