import { loadUserSelection } from "./load-user-selection.js";
import { showMessage } from "./show-message.js";
import { STATE } from "./state.js";

export async function deleteSelectedUser() {
  const user = STATE.selectedUser;
  if (STATE.isBusy || user === null) {
    return;
  }
  if (!confirm(`¿Eliminar a ${user.nombre}?`)) {
    return;
  }

  const controls = document.querySelectorAll(
    "#edit-screen input, #edit-screen button",
  );
  STATE.isBusy = true;
  showMessage("", false);
  for (const control of controls) {
    control.disabled = true;
  }

  let deleted = false;
  try {
    const id = encodeURIComponent(user.id);
    const response = await fetch(`/api/users/${id}`, { method: "DELETE" });
    const result = await response.json();

    if (!response.ok) {
      showMessage(result.error, true);
      return;
    }

    deleted = true;
  } catch {
    showMessage("No se ha podido conectar con la aplicación", true);
  } finally {
    STATE.isBusy = false;
    for (const control of controls) {
      control.disabled = false;
    }
  }

  if (deleted) {
    await loadUserSelection();
    showMessage(`${user.nombre} se ha eliminado`, false);
  }
}
