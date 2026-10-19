export async function listUsers(users) {
  try {
    return await users.list();
  } catch (error) {
    throw new Error(error.message);
  }
}
