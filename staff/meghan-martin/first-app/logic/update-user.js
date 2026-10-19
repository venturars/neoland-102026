import { findByEmail, findById, update } from "../queries/users.js";
import { parseEmail, parseName } from "./user-fields.js";

export function updateUser(id, changes) {
  const current = findById(id);
  if (!current) {
    return { ok: false, error: "USER_NOT_FOUND" };
  }
  const patch = changes ?? {};
  let name = current.name;
  if (patch.name !== undefined) {
    const nameResult = parseName(patch.name);
    if (!nameResult.ok) {
      return nameResult;
    }
    name = nameResult.name;
  }
  let email = current.email;
  if (patch.email !== undefined) {
    const emailResult = parseEmail(patch.email);
    if (!emailResult.ok) {
      return emailResult;
    }
    email = emailResult.email;
  }
  const owner = findByEmail(email);
  if (owner && owner.id !== current.id) {
    return { ok: false, error: "EMAIL_ALREADY_USED" };
  }
  const user = update({ id: current.id, name, email });
  return { ok: true, user };
}
