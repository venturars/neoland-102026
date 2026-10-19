import { findUserByEmail, insert } from "../queries/user.js";

// An address of 64 characters or more is too long.
const MAX_EMAIL_LENGTH = 64;

// Check the input, save one user, and return the saved row.

export function createUser(input) {
  const name = input.name.trim();
  if (name === "") {
    return { ok: false, error: "EMPTY_NAME" };
  }

  // Compare emails in one form: no surrounding spaces, all lower case.
  const email = typeof input?.email === "string" ? input.email.trim().toLowerCase() : "";
  const emailParts = email.split("@");
  const hasTwoParts = emailParts.length === 2;
  const bothPartsHaveText = emailParts[0]?.length > 0 && emailParts[1]?.length > 0;
  if (email.length >= MAX_EMAIL_LENGTH || hasTwoParts === false || bothPartsHaveText === false) {
    return { ok: false, error: "INVALID_EMAIL" };
  }

  // The same email cannot belong to two users.
  const existingUser = findUserByEmail(email);
  if (existingUser !== undefined && existingUser !== null) {
    return { ok: false, error: "EMAIL_ALREADY_USED" };
  }

  const user = insert({ name, email });

  return { ok: true, user };
}
