import {
  findUserByEmail,
  findUserById,
  updateUserRow,
} from "../queries/users.js";

export function updateUser(id, changes) {
  // Check id before reading changes. A bad id must fail even when
  // the changes object is also missing or invalid.
  if (!Number.isInteger(id) || id <= 0) {
    throw new Error("User id must be a positive integer");
  }

  // changes groups the optional fields. It is not one single value,
  // so it stays an object. Arrays and null are not that group.
  if (
    changes === null ||
    typeof changes !== "object" ||
    Array.isArray(changes)
  ) {
    throw new Error("User changes must be an object");
  }

  const hasName = "name" in changes;
  const hasEmail = "email" in changes;
  let name;
  let email;

  // Only a name that was actually sent is validated. A missing name
  // keeps the value already stored for this user.
  if (hasName) {
    if (typeof changes.name !== "string") {
      throw new Error("User name is required");
    }

    name = changes.name.trim();

    if (name === "") {
      throw new Error("User name is required");
    }
  }

  // Only an email that was actually sent is validated and normalized.
  // The same steps used when creating a user apply here.
  if (hasEmail) {
    if (typeof changes.email !== "string") {
      throw new Error("User email is invalid");
    }

    email = changes.email.trim().toLowerCase();
    const parts = email.split("@");
    const hasSingleAt =
      parts.length === 2 && parts[0].length > 0 && parts[1].length > 0;

    if (!hasSingleAt || email.length > 64) {
      throw new Error("User email is invalid");
    }
  }

  // Ask the database for that id. If SQLite fails, do not return
  // its message: replace it with a clear error about this operation.
  let existing;

  try {
    existing = findUserById(id);
  } catch {
    throw new Error("Unable to update user");
  }

  if (!existing) {
    throw new Error("User does not exist");
  }

  // Uniqueness is checked only when a new email was sent.
  // The same user may keep their own address. Another row may not.
  if (hasEmail) {
    let owner;

    try {
      owner = findUserByEmail(email);
    } catch {
      throw new Error("Unable to update user");
    }

    if (owner && owner.id !== existing.id) {
      throw new Error("User email is already registered");
    }
  }

  // id, created_at, and updated_at are not accepted from the client.
  // If neither name nor email was sent, nothing is written.
  let row = existing;

  if (hasName || hasEmail) {
    const nextName = hasName ? name : existing.name;
    const nextEmail = hasEmail ? email : existing.email;

    try {
      // SQLite writes updated_at inside the update statement.
      // This function does not build that date and does not send it.
      row = updateUserRow(id, nextName, nextEmail);
    } catch {
      throw new Error("Unable to update user");
    }
  }

  // Return only the fields the client needs, with camelCase names.
  // created_at stays inside the database column name until this mapping.
  return {
    id: row.id,
    name: row.name,
    email: row.email,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}
