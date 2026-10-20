import { AppError, NotFoundError, SystemError } from "./errors.js";
import * as users from "../queries/users.js";

export function deleteUser(id) {
  try {
    // 2. Check the other business rules
    if (!users.findById(id)) {
      throw new NotFoundError("User not found", { resource: "user", id });
    }

    // 3. Apply
    users.remove(id);
  } catch (error) {
    if (error instanceof AppError) throw error;
    throw new SystemError("Could not delete the user", {}, { cause: error });
  }
}
