import { findByEmail, findById, update } from "../queries/users.js";

export function updateUser(id, changes) {
  if (!Number.isInteger(id) || id <= 0) {
    throw new Error("User ID is invalid");
  }

  if (
    changes === null ||
    typeof changes !== "object" ||
    Array.isArray(changes) ||
    Object.getPrototypeOf(changes) !== Object.prototype
  ) {
    throw new Error("Invalid update fields");
  }

  const changeFields = Reflect.ownKeys(changes);

  if (changeFields.length === 0) {
    throw new Error("No changes provided");
  }

  if (changeFields.some((field) => field !== "name" && field !== "email")) {
    throw new Error("Invalid update fields");
  }

  let normalizedName;

  if (Object.hasOwn(changes, "name")) {
    if (typeof changes.name !== "string" || changes.name.trim() === "") {
      throw new Error("Name is empty");
    }

    normalizedName = changes.name.trim();
  }

  let normalizedEmail;

  if (Object.hasOwn(changes, "email")) {
    if (typeof changes.email !== "string") {
      throw new Error("Email is invalid");
    }

    normalizedEmail = changes.email.trim().toLowerCase();
    const emailParts = normalizedEmail.split("@");
    const emailHasOneAt =
      emailParts.length === 2 && emailParts[0] !== "" && emailParts[1] !== "";

    if (
      normalizedEmail.length > 64 ||
      !emailHasOneAt ||
      /\s/.test(normalizedEmail)
    ) {
      throw new Error("Email is invalid");
    }
  }

  let currentUser;

  try {
    currentUser = findById(id);
  } catch {
    throw new Error("Could not update the user");
  }

  if (!currentUser) {
    throw new Error("User not found");
  }

  if (normalizedEmail !== undefined && normalizedEmail !== currentUser.email) {
    let emailOwner;

    try {
      emailOwner = findByEmail(normalizedEmail);
    } catch {
      throw new Error("Could not update the user");
    }

    if (emailOwner && emailOwner.id !== currentUser.id) {
      throw new Error("Email is already used");
    }
  }

  try {
    const updatedUser = update({
      id,
      name: normalizedName ?? currentUser.name,
      email: normalizedEmail ?? currentUser.email,
    });

    if (!updatedUser) {
      throw new Error("User not found");
    }

    return {
      id: updatedUser.id,
      name: updatedUser.name,
      email: updatedUser.email,
      createdAt: updatedUser.createdAt,
      updatedAt: updatedUser.updatedAt,
    };
  } catch (error) {
    if (error.message.includes("UNIQUE constraint failed: users.email")) {
      throw new Error("Email is already used");
    }

    if (error.message === "User not found") {
      throw error;
    }

    throw new Error("Could not update the user");
  }
}