const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function validateId(id) {
  const userId = Number(id);

  if (!Number.isInteger(userId) || userId <= 0) {
    throw new Error("User id must be a positive integer");
  }

  return userId;
}

export function validateNombre(name) {
  if (typeof name !== "string") {
    throw new Error("Name is required");
  }

  const cleanName = name.trim();

  if (cleanName.length === 0) {
    throw new Error("Name is required");
  }

  if (cleanName.length > 100) {
    throw new Error("Name must be at most 100 characters");
  }

  return cleanName;
}

export function validateEmail(email) {
  if (typeof email !== "string") {
    throw new Error("Email is required");
  }

  const cleanEmail = email.trim().toLowerCase();

  if (!EMAIL_PATTERN.test(cleanEmail)) {
    throw new Error("Email is not valid");
  }

  return cleanEmail;
}
