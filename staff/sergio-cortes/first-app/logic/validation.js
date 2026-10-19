import { ValidationError } from "./errors.js";

export function validateName(name) {
  if (typeof name !== "string" || name.trim() === "") {
    throw new ValidationError("Name is empty");
  }
}

export function validateEmail(email) {
  if (typeof email !== "string") {
    throw new ValidationError("Email is invalid");
  }

  const trimmed = email.trim();
  const parts = trimmed.split("@");
  const hasSingleAt =
    parts.length === 2 && parts[0].length > 0 && parts[1].length > 0;

  if (!hasSingleAt || trimmed.length > 64) {
    throw new ValidationError("Email is invalid");
  }
}

export function validateId(id) {
  if (!Number.isInteger(id) || id <= 0) {
    throw new ValidationError("Invalid id");
  }
}
