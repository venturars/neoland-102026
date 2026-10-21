import { findById, removeUser } from "../queries/users.js";
import { validateId } from "./shared.js";

export { removeUser };

export function deleteUser(id) {
  const userId = validateId(id);

  const current = findById(userId);
  if (!current) {
    throw new Error("User not found");
  }

  removeUser(userId);
}
