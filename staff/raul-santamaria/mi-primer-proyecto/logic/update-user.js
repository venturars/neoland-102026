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

export async function updateUser(users, id, changes) {
  try {
    if (!users) {
      throw new Error("Users store is required");
    }

    const userId = Number(id);
    if (!Number.isInteger(userId) || userId <= 0) {
      throw new Error("User id is not valid");
    }

    if (!changes) {
      throw new Error("Provide an email or a name to update");
    }

    let email;
    let name;

    if (changes.email !== undefined) {
      email = cleanText(changes.email, "Email");
    }

    if (changes.name !== undefined) {
      name = cleanText(changes.name, "Name");
    }

    if (email === undefined && name === undefined) {
      throw new Error("Provide an email or a name to update");
    }

    const current = await users.findById(userId);
    if (!current) {
      throw new Error("No user exists with that id");
    }

    const nextEmail = email === undefined ? current.email : email;
    const nextName = name === undefined ? current.name : name;

    if (nextEmail !== current.email) {
      const rows = await users.list();
      for (const row of rows) {
        if (row.email === nextEmail) {
          throw new Error("That email already exists");
        }
      }
    }

    const saved = await users.update(userId, {
      email: nextEmail,
      name: nextName,
      updated_at: today(),
    });

    return toUser(saved);
  } catch (error) {
    throw new Error(error.message);
  }
}
