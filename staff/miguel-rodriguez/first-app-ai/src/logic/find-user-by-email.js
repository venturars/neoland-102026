import { findByEmail } from "../queries/users.js";

export function findUserByEmail(email) {
  const trimmedEmail = email.trim();
  email = trimmedEmail.toLowerCase();
  const emailParts = email.split("@");
  const emailLength = email.length;
  const emailIsTooLong = emailLength > 64;
  if (emailIsTooLong) {
    throw new Error("Email is invalid");
  }

  const emailPartCount = emailParts.length;
  const emailHasWrongPartCount = emailPartCount !== 2;
  if (emailHasWrongPartCount) {
    throw new Error("Email is invalid");
  }

  const localPart = emailParts[0];
  const localPartIsEmpty = !localPart;
  if (localPartIsEmpty) {
    throw new Error("Email is invalid");
  }

  const domain = emailParts[1];
  const domainIsEmpty = !domain;
  if (domainIsEmpty) {
    throw new Error("Email is invalid");
  }

  let user;
  try {
    user = findByEmail(email);
  } catch {
    throw new Error("Could not find the user");
  }

  const userIsMissing = !user;
  if (userIsMissing) {
    throw new Error("User not found");
  }

  return {
    id: user.id,
    name: user.name,
    email: user.email,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  };
}
