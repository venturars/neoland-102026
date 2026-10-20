import { findUserByEmail, insertUser } from "../queries/users.js";

export function createUser(input) {
  // The client must send one object. A missing object is rejected
  // here so the caller gets a business error, not a JavaScript TypeError.
  if (input === null || typeof input !== "object") {
    throw new Error("User name is required");
  }

  // A name of another type is not turned into text.
  if (typeof input.name !== "string") {
    throw new Error("User name is required");
  }

  const name = input.name.trim();

  if (name === "") {
    throw new Error("User name is required");
  }

  // An email of another type is not turned into text.
  if (typeof input.email !== "string") {
    throw new Error("User email is invalid");
  }

  // Trim spaces and lowercase the email so "Ada@Example.com"
  // and "ada@example.com" are treated as the same address.
  const email = input.email.trim().toLowerCase();
  const parts = email.split("@");
  const hasSingleAt =
    parts.length === 2 && parts[0].length > 0 && parts[1].length > 0;

  if (!hasSingleAt || email.length > 64) {
    throw new Error("User email is invalid");
  }

  // Ask the database for that email. If SQLite fails, do not return
  // its message: replace it with a clear error about this operation.
  let owner;

  try {
    owner = findUserByEmail(email);
  } catch {
    throw new Error("Unable to create user");
  }

  if (owner) {
    throw new Error("User email is already registered");
  }

  const timestamp = new Date().toISOString();
  let user;

  try {
    user = insertUser({
      name,
      email,
      createdAt: timestamp,
      updatedAt: timestamp,
    });
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
