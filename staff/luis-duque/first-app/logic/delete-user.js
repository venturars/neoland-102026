import { validateId } from "./shared.js";
import * as users from "../queries/users.js";

/**
 * Deletes a user from the SQLite database.
 */
export async function deleteUser(id) {
  const userId = validateId(id);

  if (users.deleteUser(userId) === 0) {
    throw new Error(`User ${userId} was not found`);
  }
}
