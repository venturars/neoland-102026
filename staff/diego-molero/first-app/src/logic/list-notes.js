import { findById as findUserById } from "../queries/users.js";
import { findAll } from "../queries/notes.js";

// Lista solo las notas del usuario indicado, en orden de identificador.
export function listNotes(userId) {
  if (!Number.isSafeInteger(userId) || userId <= 0) {
    throw new Error("User ID is invalid");
  }
  const user = findUserById(userId);
  if (!user) {
    throw new Error("User not found");
  }
  return findAll(userId);
}
