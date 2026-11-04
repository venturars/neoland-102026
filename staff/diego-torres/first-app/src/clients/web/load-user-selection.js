// Devuelve la lista de usuarios (viene de la capa de lógica).
import { listUsers } from "../../logic/list-users.js";
// Muestra mensajes en pantalla, normales o de error.
import { showMessage } from "./show-message.js";
// Muestra una pantalla y oculta las demás.
import { showScreen } from "./show-screen.js";
// Datos compartidos: usuario seleccionado y si la app está ocupada.
import { STATE } from "./state.js";

// Muestra la pantalla de selección y rellena el desplegable con los usuarios.
export async function loadUserSelection() {
  // Olvida el usuario anterior, marca la app como ocupada y limpia los mensajes.
  STATE.selectedUser = null;
  STATE.isBusy = true;
  showScreen("selection");
  showMessage("", false);

  // Vacía y bloquea el formulario mientras cargan los usuarios.
  const select = document.getElementById("user-select");
  const submit = document.getElementById("select-user");
  const reload = document.getElementById("reload-users");
  const status = document.getElementById("selection-status");
  select.replaceChildren();
  select.disabled = true;
  submit.disabled = true;
  reload.hidden = true;
  status.textContent = "Cargando usuarios…";

  try {
    const users = await listUsers();

    // Sin usuarios, el formulario se queda bloqueado.
    if (users.length === 0) {
      status.textContent = "No hay usuarios todavía";
      return;
    }

    // Añade una opción al desplegable por cada usuario.
    for (const user of users) {
      const option = document.createElement("option");
      option.value = user.id;
      option.textContent = `#${user.id} · ${user.name} — ${user.email}`;
      select.append(option);
    }

    // Desbloquea el formulario para poder elegir.
    select.disabled = false;
    submit.disabled = false;
    status.textContent = "Elige tu usuario y pulsa Continuar.";
  } catch (error) {
    // Si falla la carga, ofrece el botón de recargar y muestra el error.
    status.textContent = "No se ha podido cargar la lista";
    reload.hidden = false;
    showMessage(error.message, true);
  } finally {
    // Pase lo que pase, la app deja de estar ocupada.
    STATE.isBusy = false;
  }
}
