import { ValidationError } from "./errors.js";

export function validateName(name) {
  if (typeof name !== "string" || !name.trim()) {
    throw new ValidationError("Name is empty", { field: "name" });
  }
  return name.trim();
}
