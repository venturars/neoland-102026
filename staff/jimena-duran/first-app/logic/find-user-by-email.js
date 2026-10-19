import { findByEmail } from "../queries/users.js";

export function findUserByEmail(email) {
  if (typeof email !== "string") {
    throw new Error("Email is invalid");
  }

  const normalizedEmail = email.trim().toLowerCase();
  const parts = normalizedEmail.split("@");
  const hasSingleAt =
    parts.length === 2 && parts[0] !== "" && parts[1] !== "";

  if (normalizedEmail.length > 64 || !hasSingleAt || /\s/.test(normalizedEmail)) {
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