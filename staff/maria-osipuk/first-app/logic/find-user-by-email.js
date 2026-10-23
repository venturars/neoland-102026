import { findUserByEmail as findUserRowByEmail } from "../queries/users.js";

export function findUserByEmail(email) {
  // An email of another type is not turned into text.
  // The caller passes the address itself, not an object that wraps it.
  if (typeof email !== "string") {
    throw new Error("User email is invalid");
  }

  // Trim spaces and lowercase the email so "Ada@Example.com"
  // and "ada@example.com" are treated as the same address.
  const normalizedEmail = email.trim().toLowerCase();
  const parts = normalizedEmail.split("@");
  const hasSingleAt =
    parts.length === 2 && parts[0].length > 0 && parts[1].length > 0;

  // One @, text on both sides, and at most 64 characters.
  // This stays as visible steps instead of a regular expression.
  if (!hasSingleAt || normalizedEmail.length > 64) {
    throw new Error("User email is invalid");
  }

  // Ask the database for that email. If SQLite fails, do not return
  // its message: replace it with a clear error about this operation.
  let user;

  try {
    user = findUserRowByEmail(normalizedEmail);
  } catch {
    throw new Error("Unable to find user");
  }

  // A missing row is a business rule, not a database failure.
  if (!user) {
    throw new Error("User does not exist");
  }

  // Return only the fields the client needs, with camelCase names.
  // created_at stays inside the database column name until this mapping.
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    createdAt: user.created_at,
    updatedAt: user.updated_at,
  };
}
