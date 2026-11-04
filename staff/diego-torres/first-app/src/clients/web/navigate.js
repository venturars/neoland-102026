// Abre la pantalla de selección y carga los usuarios.
import { loadUserSelection } from "./load-user-selection.js";
// Abre la pantalla de edición del usuario.
import { openUserEditor } from "./open-user-editor.js";
// Abre la pantalla de notas del usuario.
import { showNotes } from "./show-notes.js";
// Abre el menú con los datos del usuario.
import { showUserMenu } from "./show-user-menu.js";
// Datos compartidos: usuario seleccionado y si la app está ocupada.
import { STATE } from "./state.js";

// Cambia de pantalla según el atributo data-action del botón pulsado.
export function navigate(event) {
  // Ignora los clics fuera de esos botones y los que llegan con la app ocupada.
  const button = event.target.closest("button[data-action]");
  if (button === null || STATE.isBusy) {
    return;
  }

  // Abre la pantalla que corresponde a la acción.
  const action = button.dataset.action;

  if (action === "selection") {
    loadUserSelection();
  }
  if (action === "menu") {
    showUserMenu();
  }
  if (action === "edit") {
    openUserEditor();
  }
  if (action === "notes") {
    showNotes();
  }
}
