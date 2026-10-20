import { deleteUserById } from "../queries/user-delete-by-id.js";
import { findUserById } from "../queries/user-find-by-id.js";
import { NotFoundError } from "./errors.js";
import { validateId } from "./validation.js";

export function deleteUser(id) {
  validateId(id);

  if (!findUserById(id)) {
    throw new NotFoundError("User not found");
  }

  deleteUserById(id);
}
