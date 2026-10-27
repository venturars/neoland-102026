// Lista todos los usuarios.
// Uso desde la terminal: node logic/listUsers.js

import { pathToFileURL } from 'node:url';
import { selectAllUsers } from '../queries/users.js';

// Devuelve la lista de usuarios (vacía si no hay ninguno).
export function listUsers() {
  return selectAllUsers();
}

// Este bloque solo se ejecuta cuando el archivo se lanza directamente con node,
// no cuando otro archivo lo importa.
const isRunFromTerminal = import.meta.url === pathToFileURL(process.argv[1]).href;

if (isRunFromTerminal) {
  try {
    const users = listUsers();

    if (users.length === 0) {
      console.log('There are no users yet.');
    } else {
      // console.table muestra la lista como una tabla en la terminal.
      console.table(users);
    }
  } catch (error) {
    console.error(`Error: ${error.message}`);
    // Código 1 = el comando terminó con error.
    process.exit(1);
  }
}
