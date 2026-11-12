import { findById } from "../queries/users.js";
import { toUser, validateId } from "./shared.js";

export { findById };

export async function findUserById(id) {
  const userId = validateId(id);
  const user = await findById(userId);

  if (!user) {
    throw new Error("User not found");
  }

  return toUser(user);
}
