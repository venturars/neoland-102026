import { findById } from "../queries/users.js";

export function findUserById(id) {
  if (typeof id !== "number" || !Number.isInteger(id) || id < 1) {
    throw new Error("Invalid id");
  }
  let user;
  try {
    user = findById(id);
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
