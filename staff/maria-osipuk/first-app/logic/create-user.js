import { findUserByEmail, insertUser } from "../queries/users.js";

export function createUser(name, email) {
  // A name of another type is not turned into text.
  // The caller passes the name itself, not an object that wraps it.
  if (typeof name !== "string") {
    throw new Error("User name is required");
  }

  // Trim spaces so a name made only of spaces is empty and rejected.
  const normalizedName = name.trim();

  if (normalizedName === "") {
    throw new Error("User name is required");
  }

  // An email of another type is not turned into text.
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
  let owner;

  try {
    owner = findUserByEmail(normalizedEmail);
  } catch {
    throw new Error("Unable to create user");
  }

  // Two users cannot share an email. This check happens before insert
  // so the caller sees a business error, not a SQLite unique failure.
  if (owner) {
    throw new Error("User email is already registered");
  }

  // SQLite writes created_at and updated_at inside the insert.
  // This function does not build those dates and does not send them.
  let user;

  try {
    user = insertUser(normalizedName, normalizedEmail);
  } catch {
    throw new Error("Unable to create user");
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
