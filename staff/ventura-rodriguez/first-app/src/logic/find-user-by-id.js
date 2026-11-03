import { findById } from "../queries/users.js";

export async function findUserById(id) {
  let user;
  try {
    user = await findById(id);
  } catch {
    throw new Error("Could not find the user");
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
