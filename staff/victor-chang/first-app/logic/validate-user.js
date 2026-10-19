import { ValidationError } from "./errors.js";

export function validateUser({ name, email }) {
  if (typeof name !== "string" || !name.trim())
    throw new ValidationError("name is required", { field: "name" });
  if (typeof email !== "string" || !email.includes("@"))
    throw new ValidationError("email is invalid", { field: "email" });
  return { name: name.trim(), email: email.trim() };
}
