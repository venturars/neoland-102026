// Modifica el nombre y/o el email de un usuario, identificado por su id.
// Para dejar un campo sin cambiar, se pasa "" en su lugar.

import { selectUserByEmail, updateUserById } from "../queries/users.js";

// Forma mínima de un email: algo@algo.algo, sin espacios.
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Actualiza el usuario y lo devuelve ya modificado. Lanza un Error si algún dato no es válido.
export function updateUser(id, name, email) {
  // Desde la terminal el id puede llegar como texto, así que se convierte a número.
  const userId = Number(id);

  // Un texto vacío cuenta como "no cambiar este campo", y se representa con null.
  let trimmedName = "";
  if (typeof name === "string") {
    trimmedName = name.trim();
  }
  let newName = null;
  if (trimmedName !== "") {
    newName = trimmedName;
  }

  let trimmedEmail = "";
  if (typeof email === "string") {
    trimmedEmail = email.trim();
  }
  const lowerCaseEmail = trimmedEmail.toLowerCase();
  let newEmail = null;
  if (lowerCaseEmail !== "") {
    newEmail = lowerCaseEmail;
  }

  const isWholeNumber = Number.isInteger(userId);
  if (!isWholeNumber) {
    throw new Error(`Invalid id: ${id}`);
  }
  if (userId <= 0) {
    throw new Error(`Invalid id: ${id}`);
  }
  if (newName === null && newEmail === null) {
    throw new Error("Provide a new name, a new email, or both.");
  }

  if (newEmail !== null) {
    const isValidEmail = EMAIL_PATTERN.test(newEmail);
    if (!isValidEmail) {
      throw new Error(`Invalid email: ${newEmail}`);
    }

    // El email no puede pertenecer a otro usuario.
    // Si pertenece al mismo usuario que se está modificando, se permite.
    const userWithSameEmail = selectUserByEmail(newEmail);
    if (userWithSameEmail) {
      if (userWithSameEmail.id !== userId) {
        throw new Error(`Email already exists: ${newEmail}`);
      }
    }
  }

  const updatedUser = updateUserById(userId, newName, newEmail);
  if (!updatedUser) {
    throw new Error(`User not found: id ${userId}`);
  }

  return {
    id: updatedUser.id,
    name: updatedUser.name,
    email: updatedUser.email,
    createdAt: updatedUser.created_at,
    updatedAt: updatedUser.updated_at,
  };
}
