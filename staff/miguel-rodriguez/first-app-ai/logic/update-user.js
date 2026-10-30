import { findById, findByEmail, update } from "../queries/users.js";

export function updateUser(id, changes) {
  let existingUser;
  try {
    existingUser = findById(id);
  } catch {
    throw new Error("Could not update the user");
  }

  const userIsMissing = !existingUser;
  if (userIsMissing) {
    throw new Error("User not found");
  }

  const suppliedName = changes.name;
  const nameIsOmitted = suppliedName === undefined;
  let name;
  if (nameIsOmitted) {
    name = existingUser.name;
  } else {
    name = suppliedName.trim();
  }
  const nameIsEmpty = !name;
  if (nameIsEmpty) {
    throw new Error("Name is empty");
  }

  const suppliedEmail = changes.email;
  const emailIsOmitted = suppliedEmail === undefined;
  let email;
  if (emailIsOmitted) {
    email = existingUser.email;
  } else {
    const trimmedEmail = suppliedEmail.trim();
    email = trimmedEmail.toLowerCase();
  }
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

  let emailOwner;
  try {
    emailOwner = findByEmail(email);
  } catch {
    throw new Error("Could not update the user");
  }

  const emailHasOwner = Boolean(emailOwner);
  if (emailHasOwner) {
    const ownerId = emailOwner.id;
    const existingUserId = existingUser.id;
    const emailBelongsToAnotherUser = ownerId !== existingUserId;
    if (emailBelongsToAnotherUser) {
      throw new Error("Email is already used");
    }
  }

  let user;
  try {
    const existingUserId = existingUser.id;
    const updatedFields = { id: existingUserId, name, email };
    user = update(updatedFields);
  } catch {
    throw new Error("Could not update the user");
  }

  return {
    id: user.id,
    name: user.name,
    email: user.email,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  };
}
