// Crea un usuario nuevo.
// Valida los datos y comprueba que el email no exista; después llama a queries.

import { insertUser, selectUserByEmail } from '../queries/users.js';

// Forma mínima de un email: algo@algo.algo, sin espacios.
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Crea el usuario y lo devuelve. Lanza un Error si algún dato no es válido.
export function createUser(name, email) {
  // Si no se recibió el dato (undefined), trim() no se ejecuta y el resultado es undefined.
  const trimmedName = name?.trim();

  // El email se guarda siempre en minúsculas para que Ana@Mail.com y ana@mail.com sean el mismo.
  const normalizedEmail = email?.trim().toLowerCase();

  if (!trimmedName) {
    throw new Error('Name is required.');
  }
  if (!normalizedEmail) {
    throw new Error('Email is required.');
  }
  if (!EMAIL_PATTERN.test(normalizedEmail)) {
    throw new Error(`Invalid email: ${normalizedEmail}`);
  }

  const existingUser = selectUserByEmail(normalizedEmail);
  if (existingUser) {
    throw new Error(`Email already exists: ${normalizedEmail}`);
  }

  return insertUser(trimmedName, normalizedEmail);
}
