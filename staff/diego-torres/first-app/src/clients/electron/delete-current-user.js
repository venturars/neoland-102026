// Borra un usuario en la base (viene de la capa de lógica).
import { deleteUser } from "../../logic/delete-user.js";
// Abre la pantalla de la lista y carga los usuarios.
import { loadUsers } from "./load-users.js";
// Muestra mensajes en pantalla, normales o de error.
import { showMessage } from "./show-message.js";
// Datos compartidos: usuario abierto y si la app está ocupada.
import { STATE } from "./state.js";

// Elimina el usuario de la ficha, si se confirma, y vuelve a la lista.
export async function deleteCurrentUser() {
  // No hace nada si hay otra operación en curso o no hay usuario abierto.
  const user = STATE.currentUser;
  if (STATE.isBusy || user === null) {
    return;
  }

  // Pide confirmación. Si se cancela, no se borra.
  if (!confirm(`¿Eliminar a ${user.name}?`)) {
    return;
  }

  // Marca la app como ocupada y limpia los mensajes.
  STATE.isBusy = true;
  showMessage("", false);

  // Intenta borrarlo y apunta si ha salido bien.
  let borrado = false;
  try {
    await deleteUser(user.id);
    borrado = true;
  } catch (error) {
    // Si falla, muestra el error y sigue en la ficha.
    showMessage(error.message, true);
  } finally {
    // Pase lo que pase, la app deja de estar ocupada.
    STATE.isBusy = false;
  }

  // Si se ha borrado, vuelve a la lista.
  if (borrado) {
    await loadUsers();
  }
}
