import { findByEmail, insert } from "../queries/users.js";
import { parseEmail, parseName } from "./user-fields.js";

export function createUser(input) {
  const nameResult = parseName(input?.name);
  if (!nameResult.ok) {
    return nameResult;
  }
  const emailResult = parseEmail(input?.email);
  if (!emailResult.ok) {
    return emailResult;
  }
  if (findByEmail(emailResult.email)) {
    return { ok: false, error: "EMAIL_ALREADY_USED" };
  }
  const user = insert({ name: nameResult.name, email: emailResult.email });
  return { ok: true, user };
}
