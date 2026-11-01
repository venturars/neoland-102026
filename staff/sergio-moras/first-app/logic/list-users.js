// Lista todos los usuarios.

import { selectAllUsers } from "../queries/users.js";

// Devuelve la lista de usuarios (vacía si no hay ninguno).
export function listUsers() {
  return selectAllUsers();
}
