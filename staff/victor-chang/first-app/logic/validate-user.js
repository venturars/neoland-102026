import { validateEmail } from "./validate-email.js";
import { validateName } from "./validate-name.js";

export function validateUser(name, email) {
  return { name: validateName(name), email: validateEmail(email) };
}
