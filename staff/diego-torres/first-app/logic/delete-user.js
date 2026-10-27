export async function deleteUser(store, id) {
  const current = await store.findById(id);
  if (!current) {
    throw new Error(`There is no user with id ${id}`);
  }
  await store.remove(id);
  return current;
}
