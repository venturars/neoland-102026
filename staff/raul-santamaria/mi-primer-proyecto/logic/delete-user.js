export async function deleteUser(users, id) {
  try {
    if (!users) {
      throw new Error("Users store is required");
    }

    const userId = Number(id);
    if (!Number.isInteger(userId) || userId <= 0) {
      throw new Error("User id is not valid");
    }

    const current = await users.findById(userId);
    if (!current) {
      throw new Error("No user exists with that id");
    }

    await users.remove(userId);
  } catch (error) {
    throw new Error(error.message);
  }
}
