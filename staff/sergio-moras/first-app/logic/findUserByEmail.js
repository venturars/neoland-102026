// Busca un usuario por su email.
// Uso desde la terminal: node logic/findUserByEmail.js "<email>"

import { pathToFileURL } from 'node:url';
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

// Este bloque solo se ejecuta cuando el archivo se lanza directamente con node,
// no cuando otro archivo lo importa.
const isRunFromTerminal = import.meta.url === pathToFileURL(process.argv[1]).href;

if (isRunFromTerminal) {
  try {
    // Los argumentos del comando empiezan en la posición 2 de process.argv.
    const [email] = process.argv.slice(2);
    const user = findUserByEmail(email);
    console.log('User found:', user);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    // Código 1 = el comando terminó con error.
    process.exit(1);
  }
}
