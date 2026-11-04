import { handleUsers } from "./handle-users.js";
import { handleNotes } from "./handle-notes.js";
import { servePublicFile } from "./serve-public-file.js";
import { sendHttpError } from "./send-http-error.js";
import { sendJson } from "./send-json.js";

// Distingue archivos públicos, API y errores sin leer rutas del disco recibidas.
export async function handleRequest(request, response) {
  try {
    const path = new URL(request.url, "http://127.0.0.1").pathname;
    if (await servePublicFile(request, response, path)) {
      return;
    }
    if (await handleUsers(request, response, path)) {
      return;
    }
    if (await handleNotes(request, response, path)) {
      return;
    }
    sendJson(response, 404, { message: "Página no encontrada." });
  } catch (error) {
    sendHttpError(response, error);
  }
}
