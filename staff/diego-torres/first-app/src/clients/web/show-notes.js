import { showMessage } from "./show-message.js";
import { showScreen } from "./show-screen.js";
import { STATE } from "./state.js";

// Abre la pantalla de notas del usuario seleccionado.
export function showNotes() {
  // Pone el nombre del usuario en la pantalla.
  const user = STATE.selectedUser;
  document.getElementById("notes-user").textContent = user.name;
  // Limpia los mensajes y muestra la pantalla.
  showMessage("", false);
  showScreen("notes");
}
