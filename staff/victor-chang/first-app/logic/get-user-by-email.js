import { AppError, NotFoundError, SystemError } from "./errors.js";
import { validateEmail } from "./validate-email.js";
import * as users from "../queries/users.js";

export function getUserByEmail(email) {
  // 1. Validate the input
  const cleanEmail = validateEmail(email);

  try {
    // 2. Check the other business rules: the user must exist
    const user = users.findByEmail(cleanEmail);
    if (!user) {
      throw new NotFoundError("User not found", {
        resource: "user",
        email: cleanEmail,
      });
    }

    // 4. Return a plain object
    return { ...user };
  } catch (error) {
    if (error instanceof AppError) throw error;
    throw new SystemError("Could not find the user", {}, { cause: error });
  }
}
