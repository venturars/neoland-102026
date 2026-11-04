import { findAll } from "../queries/users.js";

export async function listUsers() {
  let rows;
  try {
    rows = await findAll();
  } catch (error) {
    if (
      error.message === "Database is not running. Start it with npm run db."
    ) {
      throw error;
    }
    throw new Error("Could not list the users", { cause: error });
  }

  const people = rows.map((user) => {
    return {
      id: user.id,
      name: user.name,
      email: user.email,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  });
  return people;
}
