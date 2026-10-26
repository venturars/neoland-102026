// Crea un usuario nuevo.
// Valida los datos y comprueba que el email no exista; después llama a queries.
// Uso desde la terminal: node logic/createUser.js "<name>" "<email>"

import { pathToFileURL } from 'node:url';
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

// Este bloque solo se ejecuta cuando el archivo se lanza directamente con node,
// no cuando otro archivo lo importa.
const isRunFromTerminal = import.meta.url === pathToFileURL(process.argv[1]).href;

if (isRunFromTerminal) {
  try {
    // process.argv[0] y [1] son node y la ruta del archivo; los argumentos empiezan en la posición 2.
    const [name, email] = process.argv.slice(2);
    const user = createUser(name, email);
    console.log('User created:', user);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    // Código 1 = el comando terminó con error.
    process.exit(1);
  }
}
