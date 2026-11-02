export async function findUserById(store, id) {
  const user = await store.findById(id);
  if (!user) {
    throw new Error(`There is no user with id ${id}`);
  }
  return user;
}
