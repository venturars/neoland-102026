// Busca un usuario por su id (viene de la capa de lógica).
import { findUserById } from "../../logic/find-user-by-id.js";
// Muestra mensajes en pantalla, normales o de error.
import { showMessage } from "./show-message.js";
// Abre la ficha con los datos de un usuario.
import { showUser } from "./show-user.js";
// Datos compartidos: usuario abierto y si la app está ocupada.
import { STATE } from "./state.js";

// Busca el usuario con ese id y abre su ficha.
export async function openUser(id) {
  // No hace nada si hay otra operación en curso.
  if (STATE.isBusy) {
    return;
  }

  // Marca la app como ocupada y limpia los mensajes.
  STATE.isBusy = true;
  showMessage("", false);

  try {
    const user = await findUserById(id);
    showUser(user);
  } catch (error) {
    // Si falla, se queda en la lista y muestra el error.
    showMessage(error.message, true);
  } finally {
    // Pase lo que pase, la app deja de estar ocupada.
    STATE.isBusy = false;
  }
}
