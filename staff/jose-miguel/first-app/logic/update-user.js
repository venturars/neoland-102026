import {
  findUserByEmail,
  findUserById,
  updateUser as updateUserRow,
} from "../queries/users.js";

export function updateUser(id, name, email) {
  if (id === undefined || id === null || String(id).trim() === "") {
    throw new Error("User does not exist");
  }

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

  let currentUser;

  try {
    currentUser = findUserById(Number(id));
  } catch {
    throw new Error("Could not update the user");
  }

  if (!currentUser) {
    throw new Error("User does not exist");
  }

  let owner;

  try {
    owner = findUserByEmail(trimmedEmail);
  } catch {
    throw new Error("Could not update the user");
  }

  if (owner && owner.id !== currentUser.id) {
    throw new Error("A user with that email already exists");
  }

  let updatedUser;

  try {
    updatedUser = updateUserRow(currentUser.id, trimmedName, trimmedEmail);
  } catch {
    throw new Error("Could not update the user");
  }

  return {
    id: updatedUser.id,
    name: updatedUser.name,
    email: updatedUser.email,
    createdAt: updatedUser.created_at,
    updatedAt: updatedUser.updated_at,
  };
}
