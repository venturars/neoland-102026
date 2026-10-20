import {
  createUsersTable,
  findUserByEmail,
  insertUser,
} from "../queries/users.js";

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function createUser({ name, email }) {
  createUsersTable();

  const trimmedName = typeof name === "string" ? name.trim() : "";
  const trimmedEmail = typeof email === "string" ? email.trim() : "";

  if (trimmedName === "" || !emailPattern.test(trimmedEmail)) {
    return { ok: false, error: "ValidationError" };
  }

  if (findUserByEmail(trimmedEmail)) {
    return { ok: false, error: "Conflict" };
  }

  const timestamp = new Date().toISOString();
  const user = insertUser({
    name: trimmedName,
    email: trimmedEmail,
    createdAt: timestamp,
    updatedAt: timestamp,
  });

  return { ok: true, user };
}
