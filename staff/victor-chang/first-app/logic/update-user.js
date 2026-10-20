import {
  AppError,
  DuplicateError,
  NotFoundError,
  SystemError,
} from "./errors.js";
import { validateUser } from "./validate-user.js";
import * as users from "../queries/users.js";

export function updateUser(id, name, email) {
  // 1. Validate the input
  const user = validateUser(name, email);

  try {
    // 2. Check the other business rules
    if (!users.findById(id)) {
      throw new NotFoundError("User not found", { resource: "user", id });
    }
    const owner = users.findByEmail(user.email);
    if (owner && owner.id !== id) {
      throw new DuplicateError("Email is already used", {
        field: "email",
        value: user.email,
      });
    }

    // 3. Apply
    const updated = users.update(id, user.name, user.email);

    // 4. Return a plain object
    return { ...updated };
  } catch (error) {
    if (error instanceof AppError) throw error;
    throw new SystemError("Could not update the user", {}, { cause: error });
  }
}
