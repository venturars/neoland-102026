import { findById } from "../queries/users.js";
import { parseId, toUser } from "./user-fields.js";

export function findUserById(id) {
  const userId = parseId(id);
  let user;
  try {
    user = findById(userId);
  } catch {
    throw new Error("Could not find the user");
  }
  if (!user) {
    throw new Error("User not found");
  }
  return toUser(user);
}
