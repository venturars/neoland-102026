import { validateId } from "./shared.js";
import * as users from "../queries/users.js";

/**
 * Finds a user by id in the SQLite database.
 */
export async function findUserById(id) {
  const userId = validateId(id);
  const user = users.findUserById(userId);

  if (!user) {
    throw new Error(`User ${userId} was not found`);
  }

  return user;
}
