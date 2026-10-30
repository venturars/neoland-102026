import { findByEmail } from "../queries/users.js";
import { toUser, validateEmail } from "./shared.js";

export { findByEmail };

export function findUserByEmail(email) {
  const normalizedEmail = validateEmail(email);
  const user = findByEmail(normalizedEmail);

  if (!user) {
    throw new Error("User not found");
  }

  return toUser(user);
}
