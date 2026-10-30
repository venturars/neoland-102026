export async function findUserByName(store, name) {
  const trimmed = String(name ?? "").trim();
  if (trimmed === "") {
    throw new Error("Name is required");
  }
  return store.findByName(trimmed);
}
