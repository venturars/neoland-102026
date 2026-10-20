import { createUsersTable, findUserByEmail } from "../queries/users.js";

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function findUser({ email }) {
  createUsersTable();

  const trimmedEmail = typeof email === "string" ? email.trim() : "";

  if (!emailPattern.test(trimmedEmail)) {
    return { ok: false, error: "ValidationError" };
  }

  const user = findUserByEmail(trimmedEmail);
  if (!user) {
    return { ok: false, error: "NotFound" };
  }

  return { ok: true, user };
}
