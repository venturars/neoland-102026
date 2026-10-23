import { findById, findByEmail, updateUserById } from "../queries/users.js";

export function updateUser(id, changes) {
  if (!Number.isSafeInteger(id) || id <= 0) throw new Error("Id is invalid");
  if (
    changes === null || typeof changes !== "object" ||
    ![Object.prototype, null].includes(Object.getPrototypeOf(changes))
  ) {
    throw new Error("Changes are invalid");
  }
  const keys = Reflect.ownKeys(changes);
  if (keys.length === 0 || keys.some((key) => key !== "name" && key !== "email")) {
    throw new Error("Changes are invalid");
  }

  const hasName = Object.hasOwn(changes, "name");
  const hasEmail = Object.hasOwn(changes, "email");
  let name;
  if (hasName) {
    if (typeof changes.name !== "string" || !changes.name.isWellFormed()) {
      throw new Error("Name is invalid");
    }
    name = changes.name.trim();
    if (name === "") throw new Error("Name is empty");
    if (name.includes("\0") || Array.from(name).length > 100) {
      throw new Error("Name is invalid");
    }
  }

  let email;
  if (hasEmail) {
    if (typeof changes.email !== "string" || !changes.email.isWellFormed()) {
      throw new Error("Email is invalid");
    }
    email = changes.email.trim().toLowerCase();
    const parts = email.split("@");
    const labels = parts.length === 2 ? parts[1].split(".") : [];
    if (
      Array.from(email).length > 64 || email.includes("\0") || /\s/.test(email) ||
      parts.length !== 2 || parts[0] === "" || labels.length < 2 ||
      labels.some((label) => label === "")
    ) {
      throw new Error("Email is invalid");
    }
  }

  let current;
  try {
    current = findById(id);
  } catch {
    throw new Error("Could not update the user");
  }
  if (!current) throw new Error("User not found");
  if (!hasName) name = current.name;
  if (!hasEmail) email = current.email;

  let owner;
  try {
    owner = findByEmail(email);
  } catch {
    throw new Error("Could not update the user");
  }
  if (owner && owner.id !== id) throw new Error("Email is already used");

  let user;
  try {
    user = updateUserById(id, name, email);
  } catch (error) {
    // SQLITE_CONSTRAINT_UNIQUE: email is this table's only UNIQUE constraint.
    if (error.code === "ERR_SQLITE_ERROR" && error.errcode === 2067) {
      throw new Error("Email is already used");
    }
    throw new Error("Could not update the user");
  }
  if (!user) throw new Error("User not found");
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  };
}
