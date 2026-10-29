import { findUserByEmail, insertUser } from "../queries/users.js";

const MAX_NAME_LENGTH = 100;
const MAX_EMAIL_LENGTH = 255;

export function createUser(input) {
  const rawName = input[0];
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

  const rawEmail = input[1];
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
