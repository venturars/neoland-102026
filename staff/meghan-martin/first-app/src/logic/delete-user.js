import { findById, remove } from "../queries/users.js";

export async function deleteUser(id) {
  if (typeof id !== "number") {
    throw new Error("Invalid id");
  }
  if (!Number.isInteger(id)) {
    throw new Error("Invalid id");
  }
  if (id < 1) {
    throw new Error("Invalid id");
  }

  let current;
  try {
    current = await findById(id);
  } catch (error) {
    if (
      error.message === "Database is not running. Start it with npm run db."
    ) {
      throw error;
    }
    throw new Error("Could not delete the user", { cause: error });
  }
  if (!current) {
    throw new Error("User not found");
  }

  try {
    await remove(id);
  } catch (error) {
    if (
      error.message === "Database is not running. Start it with npm run db."
    ) {
      throw error;
    }
    throw new Error("Could not delete the user", { cause: error });
  }
}
