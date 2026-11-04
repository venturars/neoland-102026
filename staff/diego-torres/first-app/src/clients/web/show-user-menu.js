import { showScreen } from "./show-screen.js";
import { STATE } from "./state.js";

// Abre el menú con los datos del usuario seleccionado.
export function showUserMenu() {
  // Pone el id, el nombre y el email en la pantalla.
  const user = STATE.selectedUser;
  document.getElementById("menu-user-id").textContent = `Usuario #${user.id}`;
  document.getElementById("menu-user-name").textContent = user.name;
  document.getElementById("menu-user-email").textContent = user.email;
  showScreen("menu");
}
