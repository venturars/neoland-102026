import { findById, removeUser } from "../queries/users.js";
import { validateId } from "./shared.js";

export { removeUser };

export async function deleteUser(id) {
  const userId = validateId(id);

  const current = await findById(userId);
  if (!current) {
    throw new Error("User not found");
  }

  await removeUser(userId);
}
