import { findByEmail } from "../queries/users.js";

// An address of 64 characters or longer is rejected.
const MAX_EMAIL_LENGTH = 64;

export function findUserByEmail({ email }) {
  // Search in the same form used when the user was saved.
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

  let user;
  try {
    user = findByEmail(cleanedEmail);
  } catch {
    throw new Error("The database failed.");
  }

  if (user === undefined || user === null) {
    throw new Error("No user was found.");
  }

  return user;
}
