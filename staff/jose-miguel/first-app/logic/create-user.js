import {
  findUserByEmail,
  insertUser,
} from "../queries/users.js";

export function createUser(name, email) {
  if (name === undefined || name === null || String(name).trim() === "") {
    throw new Error("Name is required");
  }

  const trimmedName = String(name).trim();

  if (trimmedName.length > 100) {
    throw new Error("Name cannot exceed 100 characters");
  }

  if (email === undefined || email === null || String(email).trim() === "") {
    throw new Error("Email is required");
  }

  const trimmedEmail = String(email).trim().toLowerCase();

  if (trimmedEmail.length > 255) {
    throw new Error("Email cannot exceed 255 characters");
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) {
    throw new Error("Email is not valid");
  }

  let existingUser;

  try {
    existingUser = findUserByEmail(trimmedEmail);
  } catch {
    throw new Error("Could not create the user");
  }

  if (existingUser) {
    throw new Error("A user with that email already exists");
  }

  let createdUser;

  try {
    createdUser = insertUser(trimmedName, trimmedEmail);
  } catch {
    throw new Error("Could not create the user");
  }

  return {
    id: createdUser.id,
    name: createdUser.name,
    email: createdUser.email,
    createdAt: createdUser.created_at,
    updatedAt: createdUser.updated_at,
  };
}
