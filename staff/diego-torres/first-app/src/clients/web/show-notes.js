// Muestra mensajes en pantalla, normales o de error.
import { showMessage } from "./show-message.js";
// Muestra una pantalla y oculta las demás.
import { showScreen } from "./show-screen.js";
// Datos compartidos: usuario seleccionado y si la app está ocupada.
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
