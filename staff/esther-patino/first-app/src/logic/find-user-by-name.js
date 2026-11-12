import { findByName } from "../queries/users.js";
import { toUser, validateName } from "./shared.js";

export { findByName };

export async function findUserByName(name) {
  const userName = validateName(name);

  let users;

  try {
    users = await findByName(userName);
  } catch {
    throw new Error("Could not find the user");
  }

  return users.map(toUser);
}
