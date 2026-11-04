import { sendJson } from "./send-json.js";

const validationMessages = new Map([
  ["User ID is invalid", "El identificador de usuario no es válido."],
  ["Note ID is invalid", "El identificador de nota no es válido."],
  ["Input is invalid", "Los datos enviados no son válidos."],
  ["No changes provided", "Indica algún cambio antes de guardar."],
  ["Name is invalid", "Escribe un nombre válido."],
  ["Email is invalid", "Escribe un correo válido."],
  ["Note title is invalid", "Escribe un título para la nota."],
  ["Note content is invalid", "El contenido de la nota debe ser texto."],
]);

// Traduce errores conocidos sin exponer detalles internos del servidor.
export function sendHttpError(response, error) {
  if (response.headersSent) {
    response.end();
    return;
  }
  if (validationMessages.has(error.message)) {
    sendJson(response, 400, { message: validationMessages.get(error.message) });
    return;
  }
  if (error.message === "User not found") {
    sendJson(response, 404, { message: "El usuario ya no existe. Vuelve a elegirlo." });
    return;
  }
  if (error.message === "Note not found") {
    sendJson(response, 404, { message: "La nota ya no existe. Vuelve al listado." });
    return;
  }
  if (error.message === "Email is already used") {
    sendJson(response, 409, { message: "Ese correo ya pertenece a otro usuario." });
    return;
  }
  if (error.message === "JSON no válido.") {
    sendJson(response, 400, { message: error.message });
    return;
  }
  if (error.message === "Se necesita JSON.") {
    sendJson(response, 415, { message: error.message });
    return;
  }
  if (error.message === "El cuerpo es demasiado grande.") {
    sendJson(response, 413, { message: error.message });
    return;
  }
  console.error(error);
  sendJson(response, 500, { message: "No se pudo completar la operación." });
}
