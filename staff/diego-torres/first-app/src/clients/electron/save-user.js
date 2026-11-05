// Guarda los cambios de un usuario (viene de la capa de lógica).
import { updateUser } from "../../logic/update-user.js";
// Muestra mensajes en pantalla, normales o de error.
import { showMessage } from "./show-message.js";
// Abre la ficha con los datos de un usuario.
import { showUser } from "./show-user.js";
// Datos compartidos: usuario abierto y si la app está ocupada.
import { STATE } from "./state.js";

// Guarda el formulario de la ficha y muestra los datos nuevos.
export async function saveUser(event) {
  // Evita que el formulario recargue la página y no sigue si la app está ocupada o no hay usuario.
  event.preventDefault();
  if (STATE.isBusy || STATE.currentUser === null) {
    return;
  }

  // Lee lo escrito en el formulario.
  const name = document.getElementById("edit-name").value;
  const email = document.getElementById("edit-email").value;
  STATE.isBusy = true;
  showMessage("", false);

  try {
    const user = await updateUser(STATE.currentUser.id, { name, email });
    showUser(user);
    showMessage("Datos guardados", false);
  } catch (error) {
    // Si falla, lo escrito se queda para poder corregirlo.
    showMessage(error.message, true);
  } finally {
    // Pase lo que pase, la app deja de estar ocupada.
    STATE.isBusy = false;
  }
}
