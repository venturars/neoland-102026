import { showMessage } from "./show-message.js";
import { showScreen } from "./show-screen.js";
import { STATE } from "./state.js";

export async function loadUserSelection() {
  STATE.selectedUser = null;
  STATE.isBusy = true;
  showScreen("selection");

  const select = document.getElementById("user-select");
  const submit = document.getElementById("select-user");
  const reload = document.getElementById("reload-users");
  const status = document.getElementById("selection-status");
  select.replaceChildren();
  select.disabled = true;
  submit.disabled = true;
  reload.disabled = true;
  status.textContent = "Cargando la lista…";

  try {
    const response = await fetch("/api/users");
    const users = await response.json();

    if (!response.ok) {
      status.textContent = "Actualiza la lista para volver a intentarlo.";
      showMessage(users.error, true);
      return;
    }

    if (users.length === 0) {
      status.textContent = "No hay usuarios disponibles.";
      return;
    }

    const placeholder = document.createElement("option");
    placeholder.value = "";
    placeholder.textContent = "Elige un usuario";
    placeholder.disabled = true;
    placeholder.selected = true;
    select.append(placeholder);

    for (const user of users) {
      const option = document.createElement("option");
      option.value = String(user.id);
      option.textContent =
        "#" + user.id + " · " + user.name + " — " + user.email;
      select.append(option);
    }

    select.disabled = false;
    submit.disabled = false;
    status.textContent = "Selecciona el usuario con el que quieres continuar.";
  } catch {
    // A failed request is different from a successful list with no users.
    status.textContent = "Actualiza la lista para volver a intentarlo.";
    showMessage(
      "No se ha podido cargar la lista. Comprueba la conexión con la aplicación.",
      true,
    );
  } finally {
    STATE.isBusy = false;
    reload.disabled = false;
  }
}
