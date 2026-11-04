// Devuelve la lista de usuarios (viene de la capa de lógica).
import { listUsers } from "../../logic/list-users.js";
// Busca un usuario y abre su ficha.
import { openUser } from "./open-user.js";
// Muestra mensajes en pantalla, normales o de error.
import { showMessage } from "./show-message.js";
// Muestra una pantalla y oculta la otra.
import { showScreen } from "./show-screen.js";
// Datos compartidos: usuario abierto y si la app está ocupada.
import { STATE } from "./state.js";

// Abre la pantalla de la lista y la rellena con los usuarios guardados.
export async function loadUsers() {
  // No hace nada si hay otra operación en curso.
  if (STATE.isBusy) {
    return;
  }

  // Olvida el usuario abierto, marca la app como ocupada y limpia los mensajes.
  STATE.currentUser = null;
  STATE.isBusy = true;
  showScreen("list");
  showMessage("", false);

  // Vacía la lista mientras cargan los usuarios.
  const list = document.getElementById("user-list");
  const status = document.getElementById("list-status");
  list.replaceChildren();
  status.textContent = "Cargando usuarios…";

  try {
    const users = await listUsers();

    // Sin usuarios, lo dice y no hay nada más que pintar.
    if (users.length === 0) {
      status.textContent = "No hay usuarios todavía";
      return;
    }

    // Añade un botón por usuario, que abre su ficha al pulsarlo.
    status.textContent = "";
    for (const user of users) {
      const item = document.createElement("li");
      const button = document.createElement("button");
      button.type = "button";
      button.textContent = `#${user.id} · ${user.name} — ${user.email}`;
      button.addEventListener("click", () => openUser(user.id));
      item.append(button);
      list.append(item);
    }
  } catch (error) {
    // Si falla la carga, muestra el error.
    status.textContent = "";
    showMessage(error.message, true);
  } finally {
    // Pase lo que pase, la app deja de estar ocupada.
    STATE.isBusy = false;
  }
}
