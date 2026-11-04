import { findById as findUserById } from "../queries/users.js";
import { remove } from "../queries/notes.js";

// Elimina solo la nota que pertenece al usuario indicado.
export function deleteNote(userId, noteId) {
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
  const removed = remove(userId, noteId);
  if (!removed) {
    throw new Error("Note not found");
  }
}
