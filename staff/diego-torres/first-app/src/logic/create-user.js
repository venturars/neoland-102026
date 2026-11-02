import { validateNewUser } from "./shared.js";

export async function createUser(store, data) {
  const user = validateNewUser(data);
  const existing = await store.findByEmail(user.email);
  if (existing) {
    throw new Error(`Email ${user.email} is already registered`);
  }
  return store.save(user);
}
