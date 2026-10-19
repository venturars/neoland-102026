import { findUserByEmail, findUserById, update } from "../queries/user.js";

// An address of 64 characters or longer is rejected.
const MAX_EMAIL_LENGTH = 64;

// Change the name, the email, or both. undefined keeps the current value.
export function updateUser(id, name, email) {
  if (name === undefined && email === undefined) {
    throw new Error("NOTHING_TO_UPDATE");
  }

  let currentUser;
  try {
    currentUser = findUserById(id);
  } catch {
    throw new Error("DATABASE_ERROR");
  }

  if (currentUser === undefined || currentUser === null) {
    throw new Error("USER_NOT_FOUND");
  }

  let nextName = currentUser.name;
  if (name !== undefined) {
    nextName = typeof name === "string" ? name.trim() : "";
    if (nextName === "") {
      throw new Error("EMPTY_NAME");
    }
  }

  let nextEmail = currentUser.email;
  if (email !== undefined) {
    nextEmail = typeof email === "string" ? email.trim().toLowerCase() : "";
    const emailParts = nextEmail.split("@");
    const hasTwoParts = emailParts.length === 2;
    const bothPartsHaveText = emailParts[0]?.length > 0 && emailParts[1]?.length > 0;
    if (
      nextEmail.length >= MAX_EMAIL_LENGTH ||
      hasTwoParts === false ||
      bothPartsHaveText === false
    ) {
      throw new Error("INVALID_EMAIL");
    }

    let existingUser;
    try {
      existingUser = findUserByEmail(nextEmail);
    } catch {
      throw new Error("DATABASE_ERROR");
    }

    // This user may keep their own email. Another user may not take it.
    if (
      existingUser !== undefined &&
      existingUser !== null &&
      existingUser.id !== currentUser.id
    ) {
      throw new Error("EMAIL_ALREADY_USED");
    }
  }

  try {
    return update({ id: currentUser.id, name: nextName, email: nextEmail });
  } catch {
    throw new Error("DATABASE_ERROR");
  }
}
