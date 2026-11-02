import { findUserByEmail as findUserRowByEmail } from "../queries/users.js";

const MAX_EMAIL_LENGTH = 255;

export function findUserByEmail(email) {
  let emailMissing = false;
  if (email === undefined) {
    emailMissing = true;
  }
  if (email === null) {
    emailMissing = true;
  }
  let trimmedEmail = "";
  if (!emailMissing) {
    const emailAsText = String(email);
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

  let user;

  try {
    user = findUserRowByEmail(trimmedEmail);
  } catch {
    throw new Error("Could not find the user");
  }

  if (!user) {
    throw new Error("User does not exist");
  }

  return {
    id: user.id,
    name: user.name,
    email: user.email,
    createdAt: user.created_at,
    updatedAt: user.updated_at,
  };
}
