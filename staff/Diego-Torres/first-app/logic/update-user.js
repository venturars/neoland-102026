import { DuplicateEmail, UserNotFound } from "./errors.js";
import { validateChanges } from "./user.js";

export async function updateUser(store, id, changes) {
  const next = validateChanges(changes);
  const current = await store.findById(id);
  if (!current) {
    throw new UserNotFound(id);
  }
  if (next.email !== undefined && next.email !== current.email) {
    const other = await store.findByEmail(next.email);
    if (other) {
      throw new DuplicateEmail(
        `Email ${next.email} is already registered`,
      );
    }
  }
  return store.save({ ...current, ...next, id: current.id });
}
