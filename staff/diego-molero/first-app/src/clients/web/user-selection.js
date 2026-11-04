import { api } from "./api.js";
import { state } from "./state.js";
import { showScreen, notice } from "./show-screen.js";

// Cada usuario se presenta como un botón con ID y nombre, sin credenciales.
export async function showUsers(openMenu) {
  state.userId = null;
  state.noteId = null;
  showScreen("selection");
  const list = document.getElementById("users");
  const retry = document.getElementById("retry-users");
  list.textContent = "Cargando usuarios…";
  retry.hidden = true;
  try {
    const users = await api("/api/users");
    list.replaceChildren();
    if (users.length === 0) { list.textContent = "Todavía no hay usuarios. Prepara la base y crea uno con los clientes de terminal."; return; }
    for (const user of users) {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "secondary";
      button.textContent = `#${user.id} · ${user.name}`;
      button.addEventListener("click", () => { state.userId = user.id; openMenu(); });
      list.append(button);
    }
  } catch (error) { list.replaceChildren(); notice(error.message); retry.hidden = false; }
}
