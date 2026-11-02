import { findById } from "../queries/users.js";

// Valida el identificador antes de buscar y devuelve los campos públicos.
export function findUserById(id) {
  if (!Number.isSafeInteger(id) || id <= 0) {
    throw new Error("User ID is invalid");
  }
  const user = findById(id);
  if (!user) {
    throw new Error("User not found");
  }
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  };
}
