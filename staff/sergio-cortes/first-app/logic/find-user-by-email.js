import { findByEmail } from "../queries/user.js";

export function findUserByEmail(email) {
  if (typeof email !== "string" || email.includes(" ")) {
    throw new Error("Email is invalid");
  }

  const atIndex = email.indexOf("@");
  const lastAtIndex = email.lastIndexOf("@");

  if (atIndex <= 0 || atIndex !== lastAtIndex) {
    throw new Error("Email is invalid");
  }

  const domain = email.slice(atIndex + 1);
  const dotIndex = domain.lastIndexOf(".");

  if (dotIndex <= 0 || dotIndex === domain.length - 1) {
    throw new Error("Email is invalid");
  }

  const user = findByEmail(email);

  if (user === undefined) {
    return undefined;
  }

  return {
    id: user.id,
    name: user.name,
    email: user.email,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  };
}
