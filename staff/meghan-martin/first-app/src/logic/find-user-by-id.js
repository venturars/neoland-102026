import { findById } from "../queries/users.js";

export async function findUserById(id) {
  if (typeof id !== "number") {
    throw new Error("Invalid id");
  }
  if (!Number.isInteger(id)) {
    throw new Error("Invalid id");
  }
  if (id < 1) {
    throw new Error("Invalid id");
  }

  let user;
  try {
    user = await findById(id);
  } catch (error) {
    if (
      error.message === "Database is not running. Start it with npm run db."
    ) {
      throw error;
    }
    throw new Error("Could not find the user", { cause: error });
  }
  if (!user) {
    throw new Error("User not found");
  }

  return {
    id: user.id,
    name: user.name,
    email: user.email,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  };
}
