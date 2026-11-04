import { findById, remove } from "../queries/users.js";

export async function deleteUser(id) {
  let user;
  try {
    user = await findById(id);
  } catch {
    throw new Error("Could not delete the user");
  }

  const userIsMissing = !user;
  if (userIsMissing) {
    throw new Error("User not found");
  }

  try {
    await remove(id);
  } catch {
    throw new Error("Could not delete the user");
  }
}
