import { UserNotFound } from "./errors.js";

export async function findUserById(store, id) {
  const user = await store.findById(id);
  if (!user) {
    throw new UserNotFound(id);
  }
  return user;
}
