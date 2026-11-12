import { listNotes } from "../../logic/list-notes.js";
import { createNote } from "../../logic/create-note.js";
import { findNoteById } from "../../logic/find-note-by-id.js";
import { updateNote } from "../../logic/update-note.js";
import { deleteNote } from "../../logic/delete-note.js";
import { parseId, requireJson, methodNotAllowed } from "./request-helpers.js";

// El ID de usuario acompaña cada nota para impedir el acceso a notas ajenas.
export function registerNoteRoutes(app) {
  app.all("/api/users/:userId/notes", (request, response) => {
    if (!["GET", "POST"].includes(request.method)) {
      return methodNotAllowed(response, "GET, POST");
    }
    const userId = parseId(request.params.userId, "User");
    if (request.method === "GET") return response.json(listNotes(userId));
    requireJson(request);
    return response.status(201).json(createNote(userId, request.body));
  });

  app.all("/api/users/:userId/notes/:noteId", (request, response) => {
    if (!["GET", "PATCH", "DELETE"].includes(request.method)) {
      return methodNotAllowed(response, "GET, PATCH, DELETE");
    }
    const userId = parseId(request.params.userId, "User");
    const noteId = parseId(request.params.noteId, "Note");
    if (request.method === "GET") return response.json(findNoteById(userId, noteId));
    if (request.method === "PATCH") {
      requireJson(request);
      return response.json(updateNote(userId, noteId, request.body));
    }
    deleteNote(userId, noteId);
    return response.sendStatus(204);
  });
}
