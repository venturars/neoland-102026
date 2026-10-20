import { findByEmail, findById, update } from "../queries/users.js";

// An address of 64 characters or longer is rejected.
const MAX_EMAIL_LENGTH = 64;

export function updateUser({ id, name, email }) {
  if (name === undefined && email === undefined) {
    throw new Error("There is nothing to update.");
  }

  let currentUser;
  try {
    currentUser = findById(id);
  } catch {
    throw new Error("The database failed.");
  }

  if (currentUser === undefined || currentUser === null) {
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
    nextEmail = email.trim().toLowerCase();
    const emailParts = nextEmail.split("@");
    const hasTwoParts = emailParts.length === 2;
    const bothPartsHaveText =
      emailParts[0]?.length > 0 && emailParts[1]?.length > 0;
    if (
      nextEmail.length >= MAX_EMAIL_LENGTH ||
      hasTwoParts === false ||
      bothPartsHaveText === false
    ) {
      throw new Error("The email is not valid.");
    }

    let existingUser;
    try {
      existingUser = findByEmail(nextEmail);
    } catch {
      throw new Error("The database failed.");
    }

    // This user may keep their own email. Another user may not take it.
    if (
      existingUser !== undefined &&
      existingUser !== null &&
      existingUser.id !== currentUser.id
    ) {
      throw new Error("This email is already used.");
    }
  }

  try {
    return update({ id: currentUser.id, name: nextName, email: nextEmail });
  } catch {
    throw new Error("The database failed.");
  }
}
