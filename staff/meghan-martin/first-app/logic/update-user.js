import { findByEmail, findById, update } from "../queries/users.js";
import { parseEmail, parseId, parseName, toUser } from "./user-fields.js";

export function updateUser(id, changes) {
  const userId = parseId(id);
  let current;
  try {
    current = findById(userId);
  } catch {
    throw new Error("Could not update the user");
  }
  if (!current) {
    throw new Error("User not found");
  }
  const patch = changes ?? {};
  const name =
    patch.name === undefined ? current.name : parseName(patch.name);
  const email =
    patch.email === undefined ? current.email : parseEmail(patch.email);
  let owner;
  try {
    owner = findByEmail(email);
  } catch {
    throw new Error("Could not update the user");
  }
  if (owner && owner.id !== current.id) {
    throw new Error("Email is already used");
  }
  let user;
  try {
    user = update({ id: current.id, name, email });
  } catch {
    throw new Error("Could not update the user");
  }
  return toUser(user);
}
