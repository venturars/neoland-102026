export async function listUsers(store) {
  return store.findAll();
}
