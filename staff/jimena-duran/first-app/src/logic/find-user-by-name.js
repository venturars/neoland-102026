import { findByName } from "../queries/users.js";

export async function findUserByName(name) {
  const normalizedName = name.trim();

  if (!normalizedName) {
    throw new Error("Name is empty");
  }

  let users;
  try {
    users = await findByName(normalizedName);
  } catch {
    throw new Error("Could not find the user");
  }

  return users.map((user) => {
    return {
      id: user.id,
      name: user.name,
      email: user.email,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  });
}
