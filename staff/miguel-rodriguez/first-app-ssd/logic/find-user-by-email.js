import { findByEmail } from "../queries/users.js";

export function findUserByEmail(email) {
  if (typeof email !== "string" || !email.isWellFormed()) {
    throw new Error("Email is invalid");
  }
  const normalizedEmail = email.trim().toLowerCase();
  const parts = normalizedEmail.split("@");
  const labels = parts.length === 2 ? parts[1].split(".") : [];
  if (
    Array.from(normalizedEmail).length > 64 ||
    normalizedEmail.includes("\0") || /\s/.test(normalizedEmail) ||
    parts.length !== 2 || parts[0] === "" || labels.length < 2 ||
    labels.some((label) => label === "")
  ) {
    throw new Error("Email is invalid");
  }

  let user;
  try {
    user = findByEmail(normalizedEmail);
  } catch {
    throw new Error("Could not find the user");
  }
  if (!user) throw new Error("User not found");

  return {
    id: user.id,
    name: user.name,
    email: user.email,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  };
}
