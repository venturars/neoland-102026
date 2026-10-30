import { findByEmail } from "../queries/users.js";

// An address of 64 characters or longer is rejected.
const MAX_EMAIL_LENGTH = 64;

export function findUserByEmail({ email }) {
  // Search in the same form used when the user was saved.
  const trimmedEmail = email.trim();
  const cleanedEmail = trimmedEmail.toLowerCase();
  const emailIsTooLong = cleanedEmail.length >= MAX_EMAIL_LENGTH;
  const emailParts = cleanedEmail.split("@");
  const hasTwoParts = emailParts.length === 2;
  let bothPartsHaveText = false;
  if (hasTwoParts) {
    const localPart = emailParts[0];
    const domainPart = emailParts[1];
    const hasLocalPart = localPart.length > 0;
    const hasDomainPart = domainPart.length > 0;
    if (hasLocalPart) {
      if (hasDomainPart) {
        bothPartsHaveText = true;
      }
    }
  }
  if (emailIsTooLong) {
    throw new Error("The email is not valid.");
  }
  if (hasTwoParts === false) {
    throw new Error("The email is not valid.");
  }
  if (bothPartsHaveText === false) {
    throw new Error("The email is not valid.");
  }

  let user;
  try {
    user = findByEmail(cleanedEmail);
  } catch {
    throw new Error("The database failed.");
  }

  let userIsMissing = false;
  if (user === undefined) {
    userIsMissing = true;
  }
  if (user === null) {
    userIsMissing = true;
  }
  if (userIsMissing) {
    throw new Error("No user was found.");
  }

  return user;
}
