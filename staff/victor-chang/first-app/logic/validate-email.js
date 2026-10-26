import { ValidationError } from "./errors.js";

export function validateEmail(email) {
  if (typeof email !== "string" || !email.includes("@")) {
    throw new ValidationError("Email is invalid", { field: "email" });
  }
  return email.trim().toLowerCase();
}
