import { deleteUser } from "../../logic/delete-user.js";
import { loadUserSelection } from "./load-user-selection.js";
import { showMessage } from "./show-message.js";
import { STATE } from "./state.js";

// Elimina el usuario seleccionado, si se confirma, y vuelve a la selección.
export async function deleteSelectedUser() {
  // No hace nada si hay otra operación en curso o no hay usuario seleccionado.
  const user = STATE.selectedUser;
  if (STATE.isBusy || user === null) {
    return;
  }
  // Pide confirmación. Si se cancela, no se borra.
  if (!confirm(`¿Eliminar a ${user.name}?`)) {
    return;
  }

  // Bloquea los controles de la pantalla de edición mientras se borra.
  const controls = document.querySelectorAll(
    "#edit-screen input, #edit-screen button",
  );
  STATE.isBusy = true;
  showMessage("", false);
  for (const control of controls) {
    control.disabled = true;
  }

  // Intenta borrar y apunta si ha salido bien.
  let borrado = false;
  try {
    await deleteUser(user.id);
    borrado = true;
  } catch (error) {
    // Si falla, muestra el error y sigue en la pantalla de edición.
    showMessage(error.message, true);
  } finally {
    // Pase lo que pase, la app deja de estar ocupada y desbloquea los controles.
    STATE.isBusy = false;
    for (const control of controls) {
      control.disabled = false;
    }
  }

  // Si se ha borrado, vuelve a la selección y lo avisa con un mensaje.
  if (borrado) {
    await loadUserSelection();
    showMessage(`${user.name} se ha eliminado`, false);
  }
}
