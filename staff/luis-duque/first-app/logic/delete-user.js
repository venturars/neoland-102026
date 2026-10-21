import { validateId } from "./shared.js";
import { removeUser } from "../queries/users.js";

/**
 * Deletes a user from the SQLite database.
 */
export async function deleteUser(id) {
  const userId = validateId(id);

  if (removeUser(userId) === 0) {
    throw new Error(`User ${userId} was not found`);
  }
}
