import { loadUserSelection } from "./load-user-selection.js";
import { showMessage } from "./show-message.js";
import { STATE } from "./state.js";

export function resetDeleteConfirm() {
  const initial = document.getElementById("delete-initial");
  const confirm = document.getElementById("delete-confirm");
  initial.hidden = false;
  confirm.hidden = true;
}

export function showDeleteConfirm() {
  if (STATE.isBusy || STATE.selectedUser === null) {
    return;
  }

  const user = STATE.selectedUser;
  const text = document.getElementById("delete-confirm-text");
  text.textContent =
    "¿Eliminar al usuario «" +
    user.name +
    "»? Esta acción no se puede deshacer.";
  document.getElementById("delete-initial").hidden = true;
  document.getElementById("delete-confirm").hidden = false;
}

export function cancelDeleteConfirm() {
  resetDeleteConfirm();
}

export async function confirmDeleteSelectedUser() {
  if (STATE.isBusy || STATE.selectedUser === null) {
    return;
  }

  const user = STATE.selectedUser;
  const controls = document.querySelectorAll(
    "#edit-screen input, #edit-screen button",
  );
  STATE.isBusy = true;
  showMessage("", false);

  for (const control of controls) {
    control.disabled = true;
  }

  try {
    const response = await fetch("/api/users/" + user.id, { method: "DELETE" });

    if (!response.ok) {
      const problem = await response.json();
      showMessage(problem.error, true);
      resetDeleteConfirm();
      return;
    }

    await loadUserSelection();
  } catch {
    showMessage(
      "No se ha podido eliminar el usuario. Comprueba la conexión y vuelve a intentarlo.",
      true,
    );
    resetDeleteConfirm();
  } finally {
    STATE.isBusy = false;

    for (const control of controls) {
      control.disabled = false;
    }
  }
}
