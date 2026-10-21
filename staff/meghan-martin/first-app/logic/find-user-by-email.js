import { findByEmail } from "../queries/users.js";
import { parseEmail, toUser } from "./user-fields.js";

export function findUserByEmail(email) {
  const normalizedEmail = parseEmail(email);
  let user;
  try {
    user = findByEmail(normalizedEmail);
  } catch {
    throw new Error("Could not find the user");
  }
  if (!user) {
    throw new Error("User not found");
  }
  return toUser(user);
}
