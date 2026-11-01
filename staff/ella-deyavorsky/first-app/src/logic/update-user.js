import { findByEmail, findById, update } from "../queries/users.js";

// An address of 64 characters or longer is rejected.
const MAX_EMAIL_LENGTH = 64;

export function updateUser({ id, name, email }) {
  let nothingToUpdate = false;
  if (name === undefined) {
    if (email === undefined) {
      nothingToUpdate = true;
    }
  }
  if (nothingToUpdate) {
    throw new Error("There is nothing to update.");
  }

  let currentUser;
  try {
    currentUser = findById(id);
  } catch {
    throw new Error("The database failed.");
  }

  let userIsMissing = false;
  if (currentUser === undefined) {
    userIsMissing = true;
  }
  if (currentUser === null) {
    userIsMissing = true;
  }
  if (userIsMissing) {
    throw new Error("No user was found.");
  }

  let nextName = currentUser.name;
  // undefined keeps the current name.
  if (name !== undefined) {
    nextName = name.trim();
    if (nextName === "") {
      throw new Error("The name is missing.");
    }
  }

  let nextEmail = currentUser.email;
  // undefined keeps the current email.
  if (email !== undefined) {
    const trimmedEmail = email.trim();
    nextEmail = trimmedEmail.toLowerCase();
    const emailIsTooLong = nextEmail.length >= MAX_EMAIL_LENGTH;
    const emailParts = nextEmail.split("@");
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
      existingUser = findByEmail(nextEmail);
    } catch {
      throw new Error("The database failed.");
    }

    // This user may keep their own email. Another user may not take it.
    let emailUsedByAnother = false;
    if (existingUser !== undefined) {
      if (existingUser !== null) {
        const isSameUser = existingUser.id === currentUser.id;
        if (isSameUser === false) {
          emailUsedByAnother = true;
        }
      }
    }
    if (emailUsedByAnother) {
      throw new Error("This email is already used.");
    }
  }

  try {
    return update({ id: currentUser.id, name: nextName, email: nextEmail });
  } catch {
    throw new Error("The database failed.");
  }
}
