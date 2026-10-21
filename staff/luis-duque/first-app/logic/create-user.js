import { validateEmail, validateNombre } from "./shared.js";
import { insertUser } from "../queries/users.js";

/**
 * Creates a user in the SQLite database.
 */
export async function createUser({ name, email }) {
  return insertUser(validateNombre(name), validateEmail(email));
}
