import {
  findUserByEmail,
  findUserById,
  updateUserRow,
} from "../queries/users.js";

export function updateUser(input) {
  // The client must send one object. A missing object is rejected
  // here so the caller gets a business error, not a JavaScript TypeError.
  if (input === null || typeof input !== "object") {
    throw new Error("User id must be a positive integer");
  }

  // Check that id is a whole number greater than zero.
  // The client sends it as a JavaScript value, so a string like "1"
  // or a decimal like 1.5 must be rejected here, before any query runs.
  if (!Number.isInteger(input.id) || input.id <= 0) {
    throw new Error("User id must be a positive integer");
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

  // Ask the database for that id. If SQLite fails, do not return
  // its message: replace it with a clear error about this operation.
  let existing;

  try {
    existing = findUserById(input.id);
  } catch {
    throw new Error("Unable to update user");
  }

  if (!existing) {
    throw new Error("User does not exist");
  }

  let owner;

  try {
    owner = findUserByEmail(email);
  } catch {
    throw new Error("Unable to update user");
  }

  // The same user may keep their email. Another row may not take it.
  if (owner && owner.id !== existing.id) {
    throw new Error("User email is already registered");
  }

  let user;

  try {
    user = updateUserRow({
      id: input.id,
      name,
      email,
      updatedAt: new Date().toISOString(),
    });
  } catch {
    throw new Error("Unable to update user");
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
