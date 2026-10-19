function cleanText(value, fieldName) {
  if (typeof value !== "string" || value.trim() === "") {
    throw new Error(`${fieldName} is required`);
  }

  const text = value.trim();

  if (text.length > 64) {
    throw new Error(`${fieldName} must be at most 64 characters`);
  }

  return text;
}

function today() {
  return new Date().toISOString().slice(0, 10);
}

function toUser(row) {
  return {
    id: row.id,
    email: row.email,
    name: row.name,
    created_at: row.created_at,
    updated_at: row.updated_at,
  };
}

export async function createUser(users, email, name) {
  try {
    if (!users) {
      throw new Error("Users store is required");
    }

    const cleanEmail = cleanText(email, "Email");
    const cleanName = cleanText(name, "Name");

    const rows = await users.list();
    for (const row of rows) {
      if (row.email === cleanEmail) {
        throw new Error("That email already exists");
      }
    }

    const createdAt = today();
    const row = await users.insert({
      email: cleanEmail,
      name: cleanName,
      created_at: createdAt,
      updated_at: createdAt,
    });

    return toUser(row);
  } catch (error) {
    throw new Error(error.message);
  }
}
