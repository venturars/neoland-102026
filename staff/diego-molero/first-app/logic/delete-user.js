import { remove } from "../queries/users.js";

// La eliminación sigue siendo definitiva y distingue un ID inexistente.
export function deleteUser(id) {
  if (!Number.isSafeInteger(id) || id <= 0) {
    return { ok: false, error: "INVALID_ID" };
  }
  return remove(id) ? { ok: true } : { ok: false, error: "USER_NOT_FOUND" };
}
