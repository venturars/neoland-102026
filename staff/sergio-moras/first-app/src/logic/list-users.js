// Lista todos los usuarios.

import { selectAllUsers } from "../queries/users.js";

// Devuelve la lista de usuarios ordenada por id (vacía si no hay ninguno).
export function listUsers() {
  const rows = selectAllUsers();

  const users = [];
  for (const row of rows) {
    users.push({
      id: row.id,
      name: row.name,
      email: row.email,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    });
  }

  return users;
}
