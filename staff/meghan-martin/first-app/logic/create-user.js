import { findByEmail, insert } from "../queries/users.js";
import { parseEmail, parseName, toUser } from "./user-fields.js";

export function createUser(input) {
  const name = parseName(input?.name);
  const email = parseEmail(input?.email);
  let owner;
  try {
    owner = findByEmail(email);
  } catch {
    throw new Error("Could not create the user");
  }
  if (owner) {
    throw new Error("Email is already used");
  }
  let user;
  try {
    user = insert({ name, email });
  } catch {
    throw new Error("Could not create the user");
  }
  return toUser(user);
}
