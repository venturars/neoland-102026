import * as users from "../queries/users.js";

/**
 * Lists every user in the SQLite database.
 */
export async function listUsers() {
  return users.listUsers();
}
