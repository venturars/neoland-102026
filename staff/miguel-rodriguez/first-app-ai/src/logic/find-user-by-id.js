import { findById } from "../queries/users.js";

export function findUserById(id) {
  let user;
  try {
    user = findById(id);
  } catch {
    throw new Error("Could not find the user");
  }

  const userIsMissing = !user;
  if (userIsMissing) {
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
