import {
  createUsersTable,
  findUserByEmail,
  findUserById,
  updateUserRow,
} from "../queries/users.js";

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function updateUser({ id, name, email }) {
  createUsersTable();

  const trimmedName = typeof name === "string" ? name.trim() : "";
  const trimmedEmail = typeof email === "string" ? email.trim() : "";

  if (trimmedName === "" || !emailPattern.test(trimmedEmail)) {
    return { ok: false, error: "ValidationError" };
  }

  const existing = findUserById(id);
  if (!existing) {
    return { ok: false, error: "NotFound" };
  }

  const owner = findUserByEmail(trimmedEmail);
  if (owner && owner.id !== existing.id) {
    return { ok: false, error: "Conflict" };
  }

  const user = updateUserRow({
    id,
    name: trimmedName,
    email: trimmedEmail,
    updatedAt: new Date().toISOString(),
  });

  return { ok: true, user };
}
