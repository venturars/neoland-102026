import { findByEmail, findById, update } from "../queries/users.js";

export async function updateUser(id, changes) {
  if (typeof id !== "number") {
    throw new Error("Invalid id");
  }
  if (!Number.isInteger(id)) {
    throw new Error("Invalid id");
  }
  if (id < 1) {
    throw new Error("Invalid id");
  }

  let current;
  try {
    current = await findById(id);
  } catch (error) {
    if (
      error.message === "Database is not running. Start it with npm run db."
    ) {
      throw error;
    }
    throw new Error("Could not update the user", { cause: error });
  }
  if (!current) {
    throw new Error("User not found");
  }

  const patch = changes ?? {};
  let name = current.name;
  if (patch.name !== undefined) {
    if (typeof patch.name !== "string") {
      throw new Error("Name is empty");
    }
    if (patch.name.includes("\0")) {
      throw new Error("Name is empty");
    }
    const rawName = patch.name;
    name = rawName.trim();
    if (name === "") {
      throw new Error("Name is empty");
    }
  }

  let email = current.email;
  if (patch.email !== undefined) {
    if (typeof patch.email !== "string") {
      throw new Error("Email is invalid");
    }
    const rawEmail = patch.email;
    const trimmedEmail = rawEmail.trim();
    email = trimmedEmail.toLowerCase();
    const parts = email.split("@");
    const hasTwoParts = parts.length === 2;
    let hasSingleAt = false;
    if (hasTwoParts) {
      const localPart = parts[0];
      const domainPart = parts[1];
      const localPartIsFilled = localPart.length > 0;
      const domainPartIsFilled = domainPart.length > 0;
      if (localPartIsFilled) {
        if (domainPartIsFilled) {
          hasSingleAt = true;
        }
      }
    }
    const emailIsTooLong = email.length > 64;
    const emailHasSpace = /\s/.test(email);
    if (!hasSingleAt) {
      throw new Error("Email is invalid");
    }
    if (emailIsTooLong) {
      throw new Error("Email is invalid");
    }
    if (emailHasSpace) {
      throw new Error("Email is invalid");
    }
    // The part after @ must contain a dot, like example.com.
    // maria2@.com is rejected because one side of the dot is empty.
    const domainLabels = parts[1].split(".");
    let domainIsValid = domainLabels.length >= 2;
    for (const label of domainLabels) {
      if (label.length === 0) {
        domainIsValid = false;
      }
    }
    if (!domainIsValid) {
      throw new Error("Email is invalid");
    }
  }

  let owner;
  try {
    owner = await findByEmail(email);
  } catch (error) {
    if (
      error.message === "Database is not running. Start it with npm run db."
    ) {
      throw error;
    }
    throw new Error("Could not update the user", { cause: error });
  }
  if (owner) {
    if (owner.id !== current.id) {
      throw new Error("Email is already used");
    }
  }

  let savedUser;
  try {
    savedUser = await update({ id: current.id, name, email });
  } catch (error) {
    if (
      error.message === "Database is not running. Start it with npm run db."
    ) {
      throw error;
    }
    throw new Error("Could not update the user", { cause: error });
  }

  return {
    id: savedUser.id,
    name: savedUser.name,
    email: savedUser.email,
    createdAt: savedUser.createdAt,
    updatedAt: savedUser.updatedAt,
  };
}
