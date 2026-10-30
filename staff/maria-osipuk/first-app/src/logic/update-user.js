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
  // Each check can only turn the flag off, so one failure is enough.
  let changesIsObject = true;

  if (changes === null) {
    changesIsObject = false;
  }

  if (typeof changes !== "object") {
    changesIsObject = false;
  }

  if (Array.isArray(changes)) {
    changesIsObject = false;
  }

  if (!changesIsObject) {
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

    const rawName = changes.name;
    name = rawName.trim();

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

    const rawEmail = changes.email;
    const trimmedEmail = rawEmail.trim();
    email = trimmedEmail.toLowerCase();

    const parts = email.split("@");
    const hasTwoParts = parts.length === 2;
    let hasSingleAt = false;

    if (hasTwoParts) {
      const localPart = parts[0];
      const domainPart = parts[1];
      const hasLocalPart = localPart.length > 0;
      const hasDomainPart = domainPart.length > 0;

      if (hasLocalPart) {
        if (hasDomainPart) {
          hasSingleAt = true;
        }
      }
    }

    const emailIsTooLong = email.length > 64;

    if (!hasSingleAt) {
      throw new Error("User email is invalid");
    }

    if (emailIsTooLong) {
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

    let emailUsedByAnother = false;

    if (owner) {
      const sameUser = owner.id === existing.id;

      if (!sameUser) {
        emailUsedByAnother = true;
      }
    }

    if (emailUsedByAnother) {
      throw new Error("User email is already registered");
    }
  }

  // id, created_at, and updated_at are not accepted from the client.
  // If neither name nor email was sent, nothing is written.
  let hasChanges = false;

  if (hasName) {
    hasChanges = true;
  }

  if (hasEmail) {
    hasChanges = true;
  }

  let row = existing;

  if (hasChanges) {
    // A value that was not sent keeps the one already stored.
    let nextName = existing.name;

    if (hasName) {
      nextName = name;
    }

    let nextEmail = existing.email;

    if (hasEmail) {
      nextEmail = email;
    }

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
