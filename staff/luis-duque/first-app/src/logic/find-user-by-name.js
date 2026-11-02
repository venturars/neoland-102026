import { validateNombre } from "./shared.js";
import * as users from "../queries/users.js";

/**
 * Finds saved users by name in the SQLite database.
 */
export async function findUserByName(name) {
  const userName = validateNombre(name);
  const matches = users.findUserByName(userName);

  if (matches.length === 0) {
    throw new Error(`User ${userName} was not found`);
  }

  if (matches.length === 1) {
    return matches[0];
  }

  return matches;
}
