// Crea un usuario nuevo.
// Valida los datos y comprueba que el email no exista; después llama a queries.

import { insertUser, selectUserByEmail } from "../queries/users.js";

// Forma mínima de un email: algo@algo.algo, sin espacios.
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Crea el usuario y lo devuelve. Lanza un Error si algún dato no es válido.
export function createUser(name, email) {
  // Si el dato no es texto (por ejemplo, no se recibió), cuenta como vacío.
  let trimmedName = "";
  if (typeof name === "string") {
    trimmedName = name.trim();
  }

  let trimmedEmail = "";
  if (typeof email === "string") {
    trimmedEmail = email.trim();
  }
  // El email se guarda siempre en minúsculas para que Ana@Mail.com y ana@mail.com sean el mismo.
  const normalizedEmail = trimmedEmail.toLowerCase();

  if (trimmedName === "") {
    throw new Error("Name is required.");
  }
  if (normalizedEmail === "") {
    throw new Error("Email is required.");
  }
  const isValidEmail = EMAIL_PATTERN.test(normalizedEmail);
  if (!isValidEmail) {
    throw new Error(`Invalid email: ${normalizedEmail}`);
  }

  const existingUser = selectUserByEmail(normalizedEmail);
  if (existingUser) {
    throw new Error(`Email already exists: ${normalizedEmail}`);
  }

  const createdUser = insertUser(trimmedName, normalizedEmail);

  return {
    id: createdUser.id,
    name: createdUser.name,
    email: createdUser.email,
    createdAt: createdUser.created_at,
    updatedAt: createdUser.updated_at,
  };
}
