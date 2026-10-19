import { findByEmail, insert } from "../queries/users.js";

export function createUser(input) {
  const name = typeof input?.name === "string" ? input.name.trim() : "";

  if (name === "") {
    throw new Error("Name is empty");
  }

  if (typeof input.email !== "string") {
    throw new Error("Email is invalid");
  }

  const normalizedEmail = input.email.trim().toLowerCase();
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

  let existingUser;

  try {
    existingUser = findByEmail(normalizedEmail);
  } catch {
    throw new Error("Could not create the user");
  }

  if (existingUser) {
    throw new Error("Email is already used");
  }

  let createdUser;

  try {
    createdUser = insert({ name, email: normalizedEmail });
  } catch (error) {
    if (error.message.includes("UNIQUE constraint failed: users.email")) {
      throw new Error("Email is already used");
    }

    throw new Error("Could not create the user");
  }

  if (!createdUser) {
    throw new Error("Could not create the user");
  }

  return {
    id: createdUser.id,
    name: createdUser.name,
    email: createdUser.email,
    createdAt: createdUser.createdAt,
    updatedAt: createdUser.updatedAt,
  };
}