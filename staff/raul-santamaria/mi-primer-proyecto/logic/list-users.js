function toUser(row) {
  return {
    id: row.id,
    email: row.email,
    name: row.name,
    created_at: row.created_at,
    updated_at: row.updated_at,
  };
}

export async function listUsers(users) {
  try {
    if (!users) {
      throw new Error("Users store is required");
    }

    const rows = await users.list();
    const result = [];

    for (const row of rows) {
      result.push(toUser(row));
    }

    return result;
  } catch (error) {
    throw new Error(error.message);
  }
}
