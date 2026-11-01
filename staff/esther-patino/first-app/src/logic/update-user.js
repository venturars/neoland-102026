import {
  findByEmail,
  findById,
  updateUser as saveUser,
} from "../queries/users.js";
import { validateEmail, validateId, validateName, toUser } from "./shared.js";

export { findById, saveUser as updateUserQuery };

export function updateUser(id, changes = {}) {
  const userId = validateId(id);
  const next = {};

  if (changes.name !== undefined) {
    next.name = validateName(changes.name);
  }
  if (changes.email !== undefined) {
    next.email = validateEmail(changes.email);
  }

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

  let name = current.name;
  if (next.name !== undefined) {
    name = next.name;
  }

  let email = current.email;
  if (next.email !== undefined) {
    email = next.email;
  }

  const saved = saveUser({
    id: userId,
    name,
    email,
  });

  return toUser(saved);
}
