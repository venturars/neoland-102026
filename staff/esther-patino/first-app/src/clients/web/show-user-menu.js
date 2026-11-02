import { showScreen } from "./show-screen.js";
import { STATE } from "./state.js";

export function showUserMenu() {
  const user = STATE.selectedUser;

  if (user === null) {
    return;
  }

  const id = document.getElementById("menu-user-id");
  id.textContent = "Usuario #" + user.id;
  const name = document.getElementById("menu-user-name");
  name.textContent = user.name;
  const email = document.getElementById("menu-user-email");
  email.textContent = user.email;
  showScreen("menu");
}
