import { findUserByEmail } from "../queries/user-find-by-email.js";
import { findUserById } from "../queries/user-find-by-id.js";
import { updateUserById } from "../queries/user-update-by-id.js";
import { ConflictError, NotFoundError, translateQueryError } from "./errors.js";
import { toUserDto } from "./user-dto.js";
import { validateEmail, validateId, validateName } from "./validation.js";

export function updateUser({ id, name, email }) {
  validateId(id);

  const current = findUserById(id);
  if (!current) {
    throw new NotFoundError("User not found");
  }

  const nextName = name === undefined ? current.name : name;
  const nextEmail = email === undefined ? current.email : email;

  validateName(nextName);
  validateEmail(nextEmail);

  const trimmedName = nextName.trim();

  const owner = findUserByEmail(nextEmail);
  if (owner && owner.id !== id) {
    throw new ConflictError("Email is already used");
  }

  try {
    const row = updateUserById({ id, name: trimmedName, email: nextEmail });
    if (!row) {
      throw new NotFoundError("User not found");
    }

    return toUserDto(row);
  } catch (error) {
    translateQueryError(error);
  }
}
