import { listNotes } from "../../logic/list-notes.js";
import { createNote } from "../../logic/create-note.js";
import { findNoteById } from "../../logic/find-note-by-id.js";
import { updateNote } from "../../logic/update-note.js";
import { deleteNote } from "../../logic/delete-note.js";
import { readJsonBody } from "./read-json-body.js";
import { sendJson } from "./send-json.js";

function idFromPath(value, kind) {
  if (!/^\d+$/u.test(value)) {
    throw new Error(`${kind} ID is invalid`);
  }
  const id = Number(value);
  if (!Number.isSafeInteger(id) || id <= 0) {
    throw new Error(`${kind} ID is invalid`);
  }
  return id;
}

// Cada ruta mantiene los dos identificadores hasta la lógica de notas.
export async function handleNotes(request, response, path) {
  const match = /^\/api\/users\/([^/]+)\/notes(?:\/([^/]+))?$/u.exec(path);
  if (!match) {
    return false;
  }
  const isCollection = match[2] === undefined;
  const allowed = isCollection ? ["GET", "POST"] : ["GET", "PATCH", "DELETE"];
  if (!allowed.includes(request.method)) {
    response.setHeader("Allow", allowed.join(", "));
    sendJson(response, 405, { message: "Método no permitido." });
    return true;
  }
  const userId = idFromPath(match[1], "User");
  if (isCollection) {
    if (request.method === "GET") {
      sendJson(response, 200, listNotes(userId));
    } else {
      const input = await readJsonBody(request);
      sendJson(response, 201, createNote(userId, input));
    }
    return true;
  }
  const noteId = idFromPath(match[2], "Note");
  if (request.method === "GET") {
    sendJson(response, 200, findNoteById(userId, noteId));
  } else if (request.method === "PATCH") {
    const changes = await readJsonBody(request);
    sendJson(response, 200, updateNote(userId, noteId, changes));
  } else {
    deleteNote(userId, noteId);
    sendJson(response, 204);
  }
  return true;
}
