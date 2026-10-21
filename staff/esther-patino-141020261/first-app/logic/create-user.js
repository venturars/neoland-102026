import { findByEmail, insertUser } from "../queries/users.js";
import { validateEmail, validateName, toUser } from "./shared.js";

export { insertUser };

export function createUser(input) {
  const name = validateName(input?.name);
  const email = validateEmail(input?.email);

  const owner = findByEmail(email);
  if (owner) {
    throw new Error("Email is already used");
  }

  return toUser(insertUser({ name, email }));
}
