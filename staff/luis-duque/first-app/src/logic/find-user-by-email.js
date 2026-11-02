import { validateEmail } from "./shared.js";
import * as users from "../queries/users.js";

/**
 * Finds a user by email in the SQLite database.
 */
export async function findUserByEmail(email) {
  const userEmail = validateEmail(email);
  const user = users.findUserByEmail(userEmail);

  if (!user) {
    throw new Error(`User ${userEmail} was not found`);
  }

  return user;
}
