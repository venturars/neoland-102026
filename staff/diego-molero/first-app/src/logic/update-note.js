import { findById as findUserById } from "../queries/users.js";
import { findById, update } from "../queries/notes.js";

// Completa los campos omitidos sin permitir cambiar de usuario la nota.
export function updateNote(userId, noteId, changes) {
  if (!Number.isSafeInteger(userId) || userId <= 0) {
    throw new Error("User ID is invalid");
  }
  if (!Number.isSafeInteger(noteId) || noteId <= 0) {
    throw new Error("Note ID is invalid");
  }
  if (
    changes === null ||
    typeof changes !== "object" ||
    Array.isArray(changes)
  ) {
    throw new Error("Input is invalid");
  }
  const prototype = Object.getPrototypeOf(changes);
  if (prototype !== Object.prototype && prototype !== null) {
    throw new Error("Input is invalid");
  }
  const keys = Object.keys(changes);
  const hasUnknownField = keys.some((key) => key !== "title" && key !== "content");
  if (hasUnknownField) {
    throw new Error("Input is invalid");
  }
  if (changes.title === undefined && changes.content === undefined) {
    throw new Error("No changes provided");
  }
  const user = findUserById(userId);
  if (!user) {
    throw new Error("User not found");
  }
  const current = findById(userId, noteId);
  if (!current) {
    throw new Error("Note not found");
  }
  const rawTitle = changes.title === undefined ? current.title : changes.title;
  const content =
    changes.content === undefined ? current.content : changes.content;
  if (typeof rawTitle !== "string" || rawTitle.trim() === "") {
    throw new Error("Note title is invalid");
  }
  if (typeof content !== "string") {
    throw new Error("Note content is invalid");
  }
  const title = rawTitle.trim();
  const note = update({ userId, id: noteId, title, content });
  if (!note) {
    throw new Error("Note not found");
  }
  return note;
}
