import { api } from "./api.js";
import { state } from "./state.js";
import { showScreen, notice } from "./show-screen.js";

// Al volver al menú se vuelve a consultar el usuario por si cambió o desapareció.
export async function showMenu(showUsers) {
  try {
    const user = await api(`/api/users/${state.userId}`);
    document.getElementById("current-name").textContent = user.name;
    document.getElementById("current-id").textContent = `Usuario #${user.id}`;
    showScreen("menu");
  } catch (error) { await showUsers(); notice(error.message); }
}
