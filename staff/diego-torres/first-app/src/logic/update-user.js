import { validateChanges } from "./shared.js";

export async function updateUser(store, id, changes) {
  const next = validateChanges(changes);
  const current = await store.findById(id);
  if (!current) {
    throw new Error(`There is no user with id ${id}`);
  }
  if (next.email !== undefined && next.email !== current.email) {
    const other = await store.findByEmail(next.email);
    if (other) {
      throw new Error(`Email ${next.email} is already registered`);
    }
  }
  return store.save({ ...current, ...next, id: current.id });
}
