import { updateUser } from "../../logic/update-user.js";
import { showMessage } from "./show-message.js";
import { showUserMenu } from "./show-user-menu.js";
import { STATE } from "./state.js";

// Guarda los datos del formulario de edición y vuelve al menú del usuario.
export async function saveUser(event) {
  // Evita que el formulario recargue la página y no sigue si la app está ocupada o no hay usuario.
  event.preventDefault();
  if (STATE.isBusy || STATE.selectedUser === null) {
    return;
  }

  // Lee lo escrito en el formulario.
  const name = document.getElementById("user-name").value;
  const email = document.getElementById("user-email").value;
  // Bloquea los controles de la pantalla de edición mientras se guarda.
  const controls = document.querySelectorAll(
    "#edit-screen input, #edit-screen button",
  );
  STATE.isBusy = true;
  showMessage("", false);
  for (const control of controls) {
    control.disabled = true;
  }

  // Guarda los datos, se queda con el usuario actualizado y vuelve al menú.
  try {
    STATE.selectedUser = await updateUser(STATE.selectedUser.id, {
      name,
      email,
    });
    showUserMenu();
    showMessage("Datos guardados", false);
  } catch (error) {
    // El formulario se queda como estaba para corregir el dato.
    showMessage(error.message, true);
  } finally {
    // Pase lo que pase, la app deja de estar ocupada y desbloquea los controles.
    STATE.isBusy = false;
    for (const control of controls) {
      control.disabled = false;
    }
  }
}
