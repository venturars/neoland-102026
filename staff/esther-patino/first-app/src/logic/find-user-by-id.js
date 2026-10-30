import { findById } from "../queries/users.js";
import { toUser, validateId } from "./shared.js";

export { findById };

export function findUserById(id) {
  const userId = validateId(id);
  const user = findById(userId);

  if (!user) {
    throw new Error("User not found");
  }

  return toUser(user);
}
