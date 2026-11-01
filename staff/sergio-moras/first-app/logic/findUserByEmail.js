// Busca un usuario por su email.

import { selectUserByEmail } from '../queries/users.js';

// Devuelve el usuario encontrado. Lanza un Error si falta el email o no existe el usuario.
export function findUserByEmail(email) {
  // Se normaliza igual que al crear, para que la búsqueda no distinga mayúsculas.
  const normalizedEmail = email?.trim().toLowerCase();

  if (!normalizedEmail) {
    throw new Error('Email is required.');
  }

  const user = selectUserByEmail(normalizedEmail);
  if (!user) {
    throw new Error(`User not found: ${normalizedEmail}`);
  }

  return user;
}
