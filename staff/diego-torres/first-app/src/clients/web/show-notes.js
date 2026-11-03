import { showMessage } from "./show-message.js";
import { showScreen } from "./show-screen.js";
import { STATE } from "./state.js";

export function showNotes() {
  const user = STATE.selectedUser;
  document.getElementById("notes-user").textContent = user.nombre;
  showMessage("", false);
  showScreen("notes");
}
