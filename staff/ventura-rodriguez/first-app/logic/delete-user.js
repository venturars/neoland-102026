import { findById, remove } from "../queries/users.js";

export function deleteUser(id) {
  const current = findById(id);
  if (!current) {
    return { ok: false, error: "USER_NOT_FOUND" };
  }

  remove(id);
  return { ok: true };
}
