import { findByEmail, insert } from "../queries/users.js";

// An address of 64 characters or longer is rejected.
const MAX_EMAIL_LENGTH = 64;

// Save one user. name and email are separate parameters.
export function createUser(name, email) {
  // Spaces around the name do not count.
  const cleanedName = typeof name === "string" ? name.trim() : "";
  if (cleanedName === "") {
    throw new Error("EMPTY_NAME");
  }

  // Store every email in one form: no surrounding spaces, all lower case.
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

  let existingUser;
  try {
    existingUser = findByEmail(cleanedEmail);
  } catch {
    throw new Error("DATABASE_ERROR");
  }

  // The same email cannot belong to two users.
  if (existingUser !== undefined && existingUser !== null) {
    throw new Error("EMAIL_ALREADY_USED");
  }

  try {
    return insert({ name: cleanedName, email: cleanedEmail });
  } catch {
    throw new Error("DATABASE_ERROR");
  }
}
