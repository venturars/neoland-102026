import { showScreen } from "./show-screen.js";
import { STATE } from "./state.js";

export function showUserMenu() {
  const user = STATE.selectedUser;
  document.getElementById("menu-user-id").textContent = `Usuario #${user.id}`;
  document.getElementById("menu-user-name").textContent = user.nombre;
  document.getElementById("menu-user-email").textContent = user.email;
  showScreen("menu");
}
