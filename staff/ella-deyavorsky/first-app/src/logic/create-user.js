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

  let existingUser;
  try {
    existingUser = findByEmail(cleanedEmail);
  } catch {
    throw new Error("The database failed.");
  }

  // The same email cannot belong to two users.
  let emailIsUsed = false;
  if (existingUser !== undefined) {
    if (existingUser !== null) {
      emailIsUsed = true;
    }
  }
  if (emailIsUsed) {
    throw new Error("This email is already used.");
  }

  try {
    return insert({ name: cleanedName, email: cleanedEmail });
  } catch {
    throw new Error("The database failed.");
  }
}
