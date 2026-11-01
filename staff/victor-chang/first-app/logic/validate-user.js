import { ValidationError } from "./errors.js";
import { validateEmail } from "./validate-email.js";

export function validateUser(name, email) {
  if (typeof name !== "string" || !name.trim()) {
    throw new ValidationError("Name is empty", { field: "name" });
  }
  return { name: name.trim(), email: validateEmail(email) };
}
