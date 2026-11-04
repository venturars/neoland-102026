import { showMessage } from "./show-message.js";
import { showScreen } from "./show-screen.js";
import { STATE } from "./state.js";

// Abre la pantalla de edición con los datos del usuario seleccionado.
export function openUserEditor() {
  // Rellena el formulario con los datos actuales.
  const user = STATE.selectedUser;
  document.getElementById("user-name").value = user.name;
  document.getElementById("user-email").value = user.email;
  // Limpia los mensajes y muestra la pantalla.
  showMessage("", false);
  showScreen("edit");
}
