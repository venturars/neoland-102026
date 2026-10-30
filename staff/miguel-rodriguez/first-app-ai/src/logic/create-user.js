import { findByEmail, insert } from "../queries/users.js";

export function createUser(input) {
  const inputName = input.name;
  const name = inputName.trim();
  const nameIsEmpty = !name;
  if (nameIsEmpty) {
    throw new Error("Name is empty");
  }

  const inputEmail = input.email;
  const trimmedEmail = inputEmail.trim();
  const email = trimmedEmail.toLowerCase();
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

  let existingUser;
  try {
    existingUser = findByEmail(email);
  } catch {
    throw new Error("Could not create the user");
  }

  const emailIsUsed = Boolean(existingUser);
  if (emailIsUsed) {
    throw new Error("Email is already used");
  }

  let user;
  try {
    user = insert({ name, email });
  } catch {
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
