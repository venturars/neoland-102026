import { findUserByEmail as findUserRowByEmail } from "../queries/users.js";

export function findUserByEmail(email) {
  if (email === undefined || email === null || String(email).trim() === "") {
    throw new Error("Email is required");
  }

  const trimmedEmail = String(email).trim().toLowerCase();

  if (trimmedEmail.length > 255) {
    throw new Error("Email cannot exceed 255 characters");
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) {
    throw new Error("Email is not valid");
  }

  let user;

  try {
    user = findUserRowByEmail(trimmedEmail);
  } catch {
    throw new Error("Could not find the user");
  }

  if (!user) {
    throw new Error("User does not exist");
  }

  return {
    id: user.id,
    name: user.name,
    email: user.email,
    createdAt: user.created_at,
    updatedAt: user.updated_at,
  };
}
