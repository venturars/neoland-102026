import { showScreen } from "./show-screen.js";
import { STATE } from "./state.js";

export function openUserEditor() {
  const user = STATE.selectedUser;

  if (user === null) {
    return;
  }

  const name = document.getElementById("user-name");
  name.value = user.name;
  const email = document.getElementById("user-email");
  email.value = user.email;
  showScreen("edit");
}
