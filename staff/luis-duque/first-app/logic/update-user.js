import { validateEmail, validateId, validateNombre } from "./shared.js";
import * as users from "../queries/users.js";

/**
 * Updates a user in the SQLite database.
 */
export async function updateUser(id, changes = {}) {
  const userId = validateId(id);
  const hasName = Object.hasOwn(changes, "name");
  const hasEmail = Object.hasOwn(changes, "email");

  if (!hasName && !hasEmail) {
    throw new Error("Provide a name or an email to update");
  }

  const nextName = hasName ? validateNombre(changes.name) : null;
  const nextEmail = hasEmail ? validateEmail(changes.email) : null;

  if (users.updateUser(userId, nextName, nextEmail) === 0) {
    throw new Error(`User ${userId} was not found`);
  }

  return {
    id: userId,
    ...(hasName ? { name: nextName } : {}),
    ...(hasEmail ? { email: nextEmail } : {}),
  };
}
