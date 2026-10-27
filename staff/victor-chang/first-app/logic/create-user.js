import { AppError, DuplicateError, SystemError } from "./errors.js";
import { validateUser } from "./validate-user.js";
import * as users from "../queries/users.js";

export function createUser(name, email) {
  // 1. Validate the input
  const user = validateUser(name, email);

  try {
    // 2. Check the other business rules
    if (users.findByEmail(user.email)) {
      throw new DuplicateError("Email is already used", {
        field: "email",
        value: user.email,
      });
    }

    // 3. Apply
    const created = users.insert(user.name, user.email);

    // 4. Return a plain object
    return { ...created };
  } catch (error) {
    if (error instanceof AppError) throw error;
    throw new SystemError("Could not create the user", {}, { cause: error });
  }
}
