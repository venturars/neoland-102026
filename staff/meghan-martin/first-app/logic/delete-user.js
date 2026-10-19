import { findById, remove } from "../queries/users.js";
import { parseId } from "./user-fields.js";

export function deleteUser(id) {
  const userId = parseId(id);
  let current;
  try {
    current = findById(userId);
  } catch {
    throw new Error("Could not delete the user");
  }
  if (!current) {
    throw new Error("User not found");
  }
  try {
    remove(userId);
  } catch {
    throw new Error("Could not delete the user");
  }
}
