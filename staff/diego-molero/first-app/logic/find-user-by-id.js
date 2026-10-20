import { findById } from "../queries/users.js";

// Mantiene la validación del identificador y devuelve solo campos públicos.
export function findUserById(id) {
  if (!Number.isSafeInteger(id) || id <= 0) {
    return { ok: false, error: "INVALID_ID" };
  }
  const user = findById(id);
  if (!user) return { ok: false, error: "USER_NOT_FOUND" };
  return {
    ok: true,
    user: { id: user.id, name: user.name, email: user.email,
      createdAt: user.createdAt, updatedAt: user.updatedAt },
  };
}
