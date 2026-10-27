import { UserNotFound } from "./errors.js";

export async function deleteUser(store, id) {
  const current = await store.findById(id);
  if (!current) {
    throw new UserNotFound(id);
  }
  await store.remove(id);
  return current;
}
