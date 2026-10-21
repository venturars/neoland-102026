import { findByEmail, insert } from "../queries/users.js";

// An address of 64 characters or longer is rejected.
const MAX_EMAIL_LENGTH = 64;

export function createUser({ name, email }) {
  // Spaces around the name do not count.
  const cleanedName = name.trim();
  if (cleanedName === "") {
    throw new Error("The name is missing.");
  }

  // Store every email in one form: no surrounding spaces, all lower case.
  const cleanedEmail = email.trim().toLowerCase();
  const emailParts = cleanedEmail.split("@");
  const hasTwoParts = emailParts.length === 2;
  const bothPartsHaveText =
    emailParts[0]?.length > 0 && emailParts[1]?.length > 0;
  if (
    cleanedEmail.length >= MAX_EMAIL_LENGTH ||
    hasTwoParts === false ||
    bothPartsHaveText === false
  ) {
    throw new Error("The email is not valid.");
  }

  let existingUser;
  try {
    existingUser = findByEmail(cleanedEmail);
  } catch {
    throw new Error("The database failed.");
  }

  // The same email cannot belong to two users.
  if (existingUser !== undefined && existingUser !== null) {
    throw new Error("This email is already used.");
  }

  try {
    return insert({ name: cleanedName, email: cleanedEmail });
  } catch {
    throw new Error("The database failed.");
  }
}
