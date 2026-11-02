import { findByEmail } from "../queries/users.js";

export function findUserByEmail(email) {
  const trimmedEmail = email.trim();
  const normalizedEmail = trimmedEmail.toLowerCase();
  const parts = normalizedEmail.split("@");
  if (parts.length !== 2) {
    throw new Error("Email is invalid");
  }
  if (parts[0].length === 0) {
    throw new Error("Email is invalid");
  }
  if (parts[1].length === 0) {
    throw new Error("Email is invalid");
  }
  if (normalizedEmail.length > 64) {
    throw new Error("Email is invalid");
  }

  let user;
  try {
    user = findByEmail(normalizedEmail);
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
