import { findByEmail, insert } from "../queries/user.js";

export function createUser(input) {
  const name = input.name;
  const email = input.email;

  if (typeof name !== "string" || name.trim() === "") {
    throw new Error("Name is invalid");
  }

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

  const owner = findByEmail(email);

  if (owner !== undefined) {
    throw new Error("Email is already used");
  }

  const user = insert({ name, email });

  return {
    id: user.id,
    name: user.name,
    email: user.email,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  };
}
