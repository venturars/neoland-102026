// Busca un usuario por su email.

import { selectUserByEmail } from "../queries/users.js";

// Devuelve el usuario encontrado. Lanza un Error si falta el email o no existe el usuario.
export function findUserByEmail(email) {
  // Se normaliza igual que al crear, para que la búsqueda no distinga mayúsculas.
  let trimmedEmail = "";
  if (typeof email === "string") {
    trimmedEmail = email.trim();
  }
  const normalizedEmail = trimmedEmail.toLowerCase();

  if (normalizedEmail === "") {
    throw new Error("Email is required.");
  }

  const user = selectUserByEmail(normalizedEmail);
  if (!user) {
    throw new Error(`User not found: ${normalizedEmail}`);
  }

  return {
    id: user.id,
    name: user.name,
    email: user.email,
    createdAt: user.created_at,
    updatedAt: user.updated_at,
  };
}
