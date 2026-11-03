import { findById, remove } from "../queries/users.js";
import { copyUser } from "./shared.js";

export async function deleteUser(id) {
  let actual;
  try {
    actual = await findById(id);
  } catch {
    throw new Error("Could not delete the user");
  }

  if (!actual) {
    throw new Error("User not found");
  }

  try {
    await remove(actual.id);
  } catch {
    throw new Error("Could not delete the user");
  }

  return copyUser(actual);
}
