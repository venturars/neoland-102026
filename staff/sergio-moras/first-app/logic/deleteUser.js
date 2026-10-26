// Borra un usuario, identificado por su id.
// Uso desde la terminal: node logic/deleteUser.js <id>

import { pathToFileURL } from 'node:url';
import { deleteUserById } from '../queries/users.js';

// Borra el usuario y devuelve el id borrado. Lanza un Error si el id no es válido o no existe.
export function deleteUser(id) {
  // Desde la terminal el id llega como texto, así que se convierte a número.
  const userId = Number(id);

  if (!Number.isInteger(userId) || userId <= 0) {
    throw new Error(`Invalid id: ${id}`);
  }

  const wasDeleted = deleteUserById(userId);
  if (!wasDeleted) {
    throw new Error(`User not found: id ${userId}`);
  }

  return userId;
}

// Este bloque solo se ejecuta cuando el archivo se lanza directamente con node,
// no cuando otro archivo lo importa.
const isRunFromTerminal = import.meta.url === pathToFileURL(process.argv[1]).href;

if (isRunFromTerminal) {
  try {
    // Los argumentos del comando empiezan en la posición 2 de process.argv.
    const [id] = process.argv.slice(2);
    const deletedId = deleteUser(id);
    console.log(`User deleted: id ${deletedId}`);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    // Código 1 = el comando terminó con error.
    process.exit(1);
  }
}
