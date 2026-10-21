import { remove } from "../queries/users.js";

// Elimina el usuario o lanza un error si no existe.
export function deleteUser(id) {
  if (!Number.isSafeInteger(id) || id <= 0) {
    throw new Error("User ID is invalid");
  }
  if (!remove(id)) throw new Error("User not found");
}
