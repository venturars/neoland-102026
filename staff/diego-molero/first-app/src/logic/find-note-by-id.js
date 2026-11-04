import { findById as findUserById } from "../queries/users.js";
import { findById } from "../queries/notes.js";

// Una nota de otro usuario se trata como una nota no encontrada.
export function findNoteById(userId, noteId) {
  if (!Number.isSafeInteger(userId) || userId <= 0) {
    throw new Error("User ID is invalid");
  }
  if (!Number.isSafeInteger(noteId) || noteId <= 0) {
    throw new Error("Note ID is invalid");
  }
  const user = findUserById(userId);
  if (!user) {
    throw new Error("User not found");
  }
  const note = findById(userId, noteId);
  if (!note) {
    throw new Error("Note not found");
  }
  return note;
}
