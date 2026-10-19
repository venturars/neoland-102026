import { findUserByEmail as readUserByEmail } from "../queries/user.js";

// An address of 64 characters or longer is rejected.
const MAX_EMAIL_LENGTH = 64;

// Find one user by email. The email is a separate parameter.
export function findUserByEmail(email) {
  // Search in the same form used when the user was saved.
  const cleanedEmail = typeof email === "string" ? email.trim().toLowerCase() : "";
  const emailParts = cleanedEmail.split("@");
  const hasTwoParts = emailParts.length === 2;
  const bothPartsHaveText = emailParts[0]?.length > 0 && emailParts[1]?.length > 0;
  if (
    cleanedEmail.length >= MAX_EMAIL_LENGTH ||
    hasTwoParts === false ||
    bothPartsHaveText === false
  ) {
    throw new Error("INVALID_EMAIL");
  }

  let user;
  try {
    user = readUserByEmail(cleanedEmail);
  } catch {
    throw new Error("DATABASE_ERROR");
  }

  if (user === undefined || user === null) {
    throw new Error("USER_NOT_FOUND");
  }

  return user;
}
