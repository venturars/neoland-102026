// Borra un usuario, identificado por su id.

import { deleteUserById } from "../queries/users.js";

// Borra el usuario y devuelve el id borrado. Lanza un Error si el id no es válido o no existe.
export function deleteUser(id) {
  // Desde la terminal el id puede llegar como texto, así que se convierte a número.
  const userId = Number(id);

  const isWholeNumber = Number.isInteger(userId);
  if (!isWholeNumber) {
    throw new Error(`Invalid id: ${id}`);
  }
  if (userId <= 0) {
    throw new Error(`Invalid id: ${id}`);
  }

  const wasDeleted = deleteUserById(userId);
  if (!wasDeleted) {
    throw new Error(`User not found: id ${userId}`);
  }

  return userId;
}
