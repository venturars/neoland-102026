import { findByEmail, insertUser } from "../queries/users.js";
import { validateEmail, validateName, toUser } from "./shared.js";

export { insertUser };

export function createUser(input) {
  let rawName;
  let rawEmail;

  if (input !== undefined && input !== null) {
    rawName = input.name;
    rawEmail = input.email;
  }

  const name = validateName(rawName);
  const email = validateEmail(rawEmail);

  const owner = findByEmail(email);
  if (owner) {
    throw new Error("Email is already used");
  }

  const saved = insertUser({ name, email });
  return toUser(saved);
}
