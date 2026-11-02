import { remove } from "../queries/users.js";

// Elimina el usuario o lanza un error si no existe.
export function deleteUser(id) {
  if (!Number.isSafeInteger(id) || id <= 0) {
    throw new Error("User ID is invalid");
  }
  const removed = remove(id);
  if (!removed) {
    throw new Error("User not found");
  }
}
