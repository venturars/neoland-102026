import { findById as findUserById } from "../queries/users.js";
import { insert } from "../queries/notes.js";

// Asocia la nota al usuario y conserva el contenido tal como se escribió.
export function createNote(userId, input) {
  if (!Number.isSafeInteger(userId) || userId <= 0) {
    throw new Error("User ID is invalid");
  }
  if (
    input === null ||
    typeof input !== "object" ||
    Array.isArray(input)
  ) {
    throw new Error("Input is invalid");
  }
  const prototype = Object.getPrototypeOf(input);
  if (prototype !== Object.prototype && prototype !== null) {
    throw new Error("Input is invalid");
  }
  const keys = Object.keys(input);
  const hasUnknownField = keys.some((key) => key !== "title" && key !== "content");
  if (hasUnknownField) {
    throw new Error("Input is invalid");
  }
  const user = findUserById(userId);
  if (!user) {
    throw new Error("User not found");
  }
  if (typeof input.title !== "string" || input.title.trim() === "") {
    throw new Error("Note title is invalid");
  }
  if (typeof input.content !== "string") {
    throw new Error("Note content is invalid");
  }
  const title = input.title.trim();
  const content = input.content;
  return insert({ userId, title, content });
}
