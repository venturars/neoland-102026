import { showMessage } from "./show-message.js";
import { showScreen } from "./show-screen.js";
import { STATE } from "./state.js";

export async function loadUserSelection() {
  STATE.selectedUser = null;
  STATE.isBusy = true;
  showScreen("selection");
  showMessage("", false);

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
    const response = await fetch("/api/users");
    const users = await response.json();

    if (!response.ok) {
      status.textContent = "No se ha podido cargar la lista";
      reload.hidden = false;
      return;
    }

    if (users.length === 0) {
      status.textContent = "No hay usuarios todavía";
      return;
    }

    for (const user of users) {
      const option = document.createElement("option");
      option.value = user.id;
      option.textContent = `#${user.id} · ${user.nombre} — ${user.email}`;
      select.append(option);
    }

    select.disabled = false;
    submit.disabled = false;
    status.textContent = "Elige tu usuario y pulsa Continuar.";
  } catch {
    status.textContent = "No se ha podido cargar la lista";
    reload.hidden = false;
  } finally {
    STATE.isBusy = false;
  }
}
