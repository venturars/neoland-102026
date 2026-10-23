import { findByEmail, insertUser } from "../queries/users.js";

export function createUser(name, email) {
  if (typeof name !== "string" || !name.isWellFormed()) throw new Error("Name is invalid");
  const normalizedName = name.trim();
  if (normalizedName === "") throw new Error("Name is empty");
  if (normalizedName.includes("\0") || Array.from(normalizedName).length > 100) {
    throw new Error("Name is invalid");
  }

  if (typeof email !== "string" || !email.isWellFormed()) throw new Error("Email is invalid");
  const normalizedEmail = email.trim().toLowerCase();
  const parts = normalizedEmail.split("@");
  const labels = parts.length === 2 ? parts[1].split(".") : [];
  if (
    Array.from(normalizedEmail).length > 64 ||
    normalizedEmail.includes("\0") ||
    /\s/.test(normalizedEmail) ||
    parts.length !== 2 ||
    parts[0] === "" ||
    labels.length < 2 ||
    labels.some((label) => label === "")
  ) {
    throw new Error("Email is invalid");
  }

  let owner;
  try {
    owner = findByEmail(normalizedEmail);
  } catch {
    throw new Error("Could not create the user");
  }
  if (owner) throw new Error("Email is already used");

  let user;
  try {
    user = insertUser(normalizedName, normalizedEmail);
  } catch (error) {
    // SQLITE_CONSTRAINT_UNIQUE: email is this table's only UNIQUE constraint.
    if (error.code === "ERR_SQLITE_ERROR" && error.errcode === 2067) {
      throw new Error("Email is already used");
    }
    throw new Error("Could not create the user");
  }

  return {
    id: user.id,
    name: user.name,
    email: user.email,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  };
}
