import { AppError, NotFoundError, SystemError } from "./errors.js";
import * as users from "../queries/users.js";

export function getUser(id) {
  try {
    // 2. Check the other business rules: the user must exist
    const user = users.findById(id);
    if (!user) {
      throw new NotFoundError("User not found", { resource: "user", id });
    }

    // 4. Return a plain object
    return { ...user };
  } catch (error) {
    if (error instanceof AppError) throw error;
    throw new SystemError("Could not find the user", {}, { cause: error });
  }
}
