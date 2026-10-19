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

export async function createUser(users, email, name) {
  try {
    const cleanEmail = cleanText(email, "Email");
    const cleanName = cleanText(name, "Name");

    const existing = await users.findByEmail(cleanEmail);
    if (existing) {
      throw new Error("That email already exists");
    }

    return await users.insert({ email: cleanEmail, name: cleanName });
  } catch (error) {
    throw new Error(error.message);
  }
}
