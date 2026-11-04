import { SystemError } from "./errors.js";
import { validateName } from "./validate-name.js";
import * as users from "../queries/users.js";

export function findUserByName(name) {
  // 1. Validate the input
  const cleanName = validateName(name);

  try {
    // 3. Apply
    const found = users.findByName(cleanName);

    // 4. Return plain objects
    return found.map((user) => ({ ...user }));
  } catch (error) {
    throw new SystemError("Could not find the user", {}, { cause: error });
  }
}
