// Modifica el nombre y/o el email de un usuario, identificado por su id.
// Uso desde la terminal: node logic/updateUser.js <id> "<name>" "<email>"
// Para dejar un campo sin cambiar, se pasa "" en su lugar.

import { pathToFileURL } from 'node:url';
import { selectUserByEmail, updateUserById } from '../queries/users.js';

// Forma mínima de un email: algo@algo.algo, sin espacios.
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Actualiza el usuario y lo devuelve ya modificado. Lanza un Error si algún dato no es válido.
export function updateUser(id, name, email) {
  // Desde la terminal el id llega como texto, así que se convierte a número.
  const userId = Number(id);

  // Un texto vacío cuenta como "no cambiar este campo", y se representa con null.
  // Si no se recibió el dato (undefined), trim() no se ejecuta y también queda null.
  const trimmedName = name?.trim() || null;
  const normalizedEmail = email?.trim().toLowerCase() || null;

  if (!Number.isInteger(userId) || userId <= 0) {
    throw new Error(`Invalid id: ${id}`);
  }
  if (!trimmedName && !normalizedEmail) {
    throw new Error('Provide a new name, a new email, or both.');
  }

  if (normalizedEmail) {
    if (!EMAIL_PATTERN.test(normalizedEmail)) {
      throw new Error(`Invalid email: ${normalizedEmail}`);
    }

    // El email no puede pertenecer a otro usuario.
    // Si pertenece al mismo usuario que se está modificando, se permite.
    const userWithSameEmail = selectUserByEmail(normalizedEmail);
    if (userWithSameEmail && userWithSameEmail.id !== userId) {
      throw new Error(`Email already exists: ${normalizedEmail}`);
    }
  }

  const updatedUser = updateUserById(userId, trimmedName, normalizedEmail);
  if (!updatedUser) {
    throw new Error(`User not found: id ${userId}`);
  }

  return updatedUser;
}

// Este bloque solo se ejecuta cuando el archivo se lanza directamente con node,
// no cuando otro archivo lo importa.
const isRunFromTerminal = import.meta.url === pathToFileURL(process.argv[1]).href;

if (isRunFromTerminal) {
  try {
    // Los argumentos del comando empiezan en la posición 2 de process.argv.
    const [id, name, email] = process.argv.slice(2);
    const user = updateUser(id, name, email);
    console.log('User updated:', user);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    // Código 1 = el comando terminó con error.
    process.exit(1);
  }
}
