import { showMessage } from "./show-message.js";
import { showScreen } from "./show-screen.js";
import { STATE } from "./state.js";

export function openUserEditor() {
  const user = STATE.selectedUser;
  document.getElementById("user-name").value = user.name;
  document.getElementById("user-email").value = user.email;
  showMessage("", false);
  showScreen("edit");
}
