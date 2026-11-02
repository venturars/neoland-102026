import { findByEmail } from "../queries/users.js";

export function findUserByEmail(email) {
  if (typeof email !== "string") {
    throw new Error("Email is invalid");
  }
  const rawEmail = email;
  const trimmedEmail = rawEmail.trim();
  const normalizedEmail = trimmedEmail.toLowerCase();
  const parts = normalizedEmail.split("@");
  const hasTwoParts = parts.length === 2;
  let hasSingleAt = false;
  if (hasTwoParts) {
    const localPart = parts[0];
    const domainPart = parts[1];
    const localPartIsFilled = localPart.length > 0;
    const domainPartIsFilled = domainPart.length > 0;
    if (localPartIsFilled) {
      if (domainPartIsFilled) {
        hasSingleAt = true;
      }
    }
  }
  const emailIsTooLong = normalizedEmail.length > 64;
  const emailHasSpace = /\s/.test(normalizedEmail);
  if (!hasSingleAt) {
    throw new Error("Email is invalid");
  }
  if (emailIsTooLong) {
    throw new Error("Email is invalid");
  }
  if (emailHasSpace) {
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
