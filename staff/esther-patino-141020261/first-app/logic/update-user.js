import {
  createUsersTable,
  findByEmail,
  findById,
  updateUser as saveUser,
} from "../queries/users.js";
import { parseEmail, parseId, parseName, toUser } from "./user-rules.js";

export { findById, saveUser as updateUserQuery };

export function updateUser(id, changes = {}) {
  const userId = parseId(id);
  const next = {};

  if (changes.name !== undefined) {
    next.name = parseName(changes.name);
  }
  if (changes.email !== undefined) {
    next.email = parseEmail(changes.email);
  }

  createUsersTable();

  const current = findById(userId);
  if (!current) {
    throw new Error("User not found");
  }

  if (next.email !== undefined) {
    const owner = findByEmail(next.email);
    if (owner && owner.id !== userId) {
      throw new Error("Email is already used");
    }
  }

  if (next.name === undefined && next.email === undefined) {
    return toUser(current);
  }

  return toUser(
    saveUser({
      id: userId,
      name: next.name ?? current.name,
      email: next.email ?? current.email,
    }),
  );
}
