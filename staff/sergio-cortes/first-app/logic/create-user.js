import { insertUser } from "../queries/user-insert.js";
import { findUserByEmail } from "../queries/user-find-by-email.js";
import { ConflictError, translateQueryError } from "./errors.js";
import { toUserDto } from "./user-dto.js";
import { validateEmail, validateName } from "./validation.js";

export function createUser(input) {
  validateName(input.name);
  validateEmail(input.email);

  const name = input.name.trim();

  if (findUserByEmail(input.email)) {
    throw new ConflictError("Email is already used");
  }

  try {
    const row = insertUser({ name, email: input.email });
    return toUserDto(row);
  } catch (error) {
    translateQueryError(error);
  }
}
