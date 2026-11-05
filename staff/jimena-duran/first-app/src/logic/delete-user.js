import { findById, remove } from "../queries/users.js";

export async function deleteUser(id) {
  let current;
  try {
    current = await findById(id);
  } catch {
    throw new Error("Could not delete the user");
  }

  if (!current) {
    throw new Error("User not found");
  }

  try {
    await remove(id);
  } catch {
    throw new Error("Could not delete the user");
  }
}
