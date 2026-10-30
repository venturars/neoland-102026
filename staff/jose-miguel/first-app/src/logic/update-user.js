import {
  findUserByEmail,
  findUserById,
  updateUser as updateUserRow,
} from "../queries/users.js";

const MAX_NAME_LENGTH = 100;
const MAX_EMAIL_LENGTH = 255;

export function updateUser(id, changes) {
  let idMissing = false;
  if (id === undefined) {
    idMissing = true;
  }
  if (id === null) {
    idMissing = true;
  }
  if (!idMissing) {
    const idAsText = String(id);
    const trimmedId = idAsText.trim();
    if (trimmedId === "") {
      idMissing = true;
    }
  }
  if (idMissing) {
    throw new Error("User does not exist");
  }

  const rawName = changes[0];
  let nameMissing = false;
  if (rawName === undefined) {
    nameMissing = true;
  }
  if (rawName === null) {
    nameMissing = true;
  }
  let trimmedName = "";
  if (!nameMissing) {
    const nameAsText = String(rawName);
    trimmedName = nameAsText.trim();
  }
  if (trimmedName === "") {
    nameMissing = true;
  }
  if (nameMissing) {
    throw new Error("Name is required");
  }
  const nameIsTooLong = trimmedName.length > MAX_NAME_LENGTH;
  if (nameIsTooLong) {
    throw new Error("Name cannot exceed 100 characters");
  }

  const rawEmail = changes[1];
  let emailMissing = false;
  if (rawEmail === undefined) {
    emailMissing = true;
  }
  if (rawEmail === null) {
    emailMissing = true;
  }
  let trimmedEmail = "";
  if (!emailMissing) {
    const emailAsText = String(rawEmail);
    const trimmedEmailRaw = emailAsText.trim();
    trimmedEmail = trimmedEmailRaw.toLowerCase();
  }
  if (trimmedEmail === "") {
    emailMissing = true;
  }
  if (emailMissing) {
    throw new Error("Email is required");
  }
  const emailIsTooLong = trimmedEmail.length > MAX_EMAIL_LENGTH;
  if (emailIsTooLong) {
    throw new Error("Email cannot exceed 255 characters");
  }
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const emailIsValid = emailPattern.test(trimmedEmail);
  if (!emailIsValid) {
    throw new Error("Email is not valid");
  }

  let currentUser;

  try {
    const numericId = Number(id);
    currentUser = findUserById(numericId);
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

  let emailUsedByAnother = false;
  if (owner) {
    const sameUser = owner.id === currentUser.id;
    if (!sameUser) {
      emailUsedByAnother = true;
    }
  }
  if (emailUsedByAnother) {
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
