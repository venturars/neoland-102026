// Busca los usuarios que se llaman exactamente como el nombre recibido.

import { selectUsersByName } from "../queries/users.js";

// Devuelve la lista de usuarios con ese nombre, ordenada por id (vacía si no hay ninguno).
// Lanza un Error si falta el nombre.
export function findUserByName(name) {
  // Los espacios del principio y del final no cuentan. Si el dato no es texto, cuenta como vacío.
  let trimmedName = "";
  if (typeof name === "string") {
    trimmedName = name.trim();
  }

  if (trimmedName === "") {
    throw new Error("Name is required.");
  }

  const rows = selectUsersByName(trimmedName);

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
