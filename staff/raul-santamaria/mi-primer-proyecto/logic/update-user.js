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

export async function updateUser(users, id, changes) {
  try {
    const userId = Number(id);
    if (!Number.isInteger(userId) || userId <= 0) {
      throw new Error("User id is not valid");
    }

    const current = await users.findById(userId);
    if (!current) {
      throw new Error("No user exists with that id");
    }

    if (changes.email !== undefined) {
      const cleanEmail = cleanText(changes.email, "Email");

      if (cleanEmail !== current.email) {
        const taken = await users.findByEmail(cleanEmail);
        if (taken) {
          throw new Error("That email already exists");
        }
      }

      changes.email = cleanEmail;
    }

    if (changes.name !== undefined) {
      changes.name = cleanText(changes.name, "Name");
    }

    if (changes.email === undefined && changes.name === undefined) {
      throw new Error("Provide an email or a name to update");
    }

    return await users.update(userId, changes);
  } catch (error) {
    throw new Error(error.message);
  }
}
