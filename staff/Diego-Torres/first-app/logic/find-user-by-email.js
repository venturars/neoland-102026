import { validateEmail } from "./user.js";

export async function findUserByEmail(store, email) {
  const normalized = validateEmail(email);
  return store.findByEmail(normalized);
}
