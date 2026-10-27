import { InvalidData } from "./errors.js";

export async function findUserByName(store, name) {
  const trimmed = String(name ?? "").trim();
  if (trimmed === "") {
    throw new InvalidData("Name is required");
  }
  return store.findByName(trimmed);
}
