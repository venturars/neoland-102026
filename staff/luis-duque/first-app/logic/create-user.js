import { validateEmail, validateNombre } from "./shared.js";
import * as users from "../queries/users.js";

/**
 * Creates a user in the SQLite database.
 */
export async function createUser({ name, email }) {
  return users.createUser(validateNombre(name), validateEmail(email));
}
