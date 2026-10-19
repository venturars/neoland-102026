import { findUserByEmail, findUserById, update } from "../queries/user.js";

// An address of 64 characters or more is too long.
const MAX_EMAIL_LENGTH = 64;

// A field is being changed when the caller included it.
function hasField(input, fieldName) {
  return input[fieldName] !== undefined;
}

// Change the name, the email, or both. A missing field stays as it is.
export function updateUser(input) {
  const currentUser = findUserById(input.id);
  if (currentUser === undefined || currentUser === null) {
    return { ok: false, error: "USER_NOT_FOUND" };
  }

  const hasName = hasField(input, "name");
  const hasEmail = hasField(input, "email");
  if (hasName === false && hasEmail === false) {
    return { ok: false, error: "NOTHING_TO_UPDATE" };
  }

  let name = currentUser.name;
  if (hasName === true) {
    name = typeof input.name === "string" ? input.name.trim() : "";
    if (name === "") {
      return { ok: false, error: "EMPTY_NAME" };
    }
  }

  let email = currentUser.email;
  if (hasEmail === true) {
    // Compare emails in one form: no surrounding spaces, all lower case.
    email = typeof input.email === "string" ? input.email.trim().toLowerCase() : "";
    const emailParts = email.split("@");
    const hasTwoParts = emailParts.length === 2;
    const bothPartsHaveText = emailParts[0]?.length > 0 && emailParts[1]?.length > 0;
    if (email.length >= MAX_EMAIL_LENGTH || hasTwoParts === false || bothPartsHaveText === false) {
      return { ok: false, error: "INVALID_EMAIL" };
    }

    // This user may keep their own email. Another user may not take it.
    const existingUser = findUserByEmail(email);
    if (existingUser !== undefined && existingUser !== null && existingUser.id !== currentUser.id) {
      return { ok: false, error: "EMAIL_ALREADY_USED" };
    }
  }

  const user = update({ id: currentUser.id, name, email });

  return { ok: true, user };
}
