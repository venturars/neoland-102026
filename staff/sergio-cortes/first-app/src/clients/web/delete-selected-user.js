import { loadUserSelection } from "./load-user-selection.js";
import { showMessage } from "./show-message.js";
import { STATE } from "./state.js";

function getDeletePopover() {
  return document.getElementById("delete-popover");
}

export function resetDeleteConfirm() {
  const popover = getDeletePopover();

  if (popover.open) {
    popover.close();
  }
}

export function showDeleteConfirm() {
  if (STATE.isBusy || STATE.selectedUser === null) {
    return;
  }

  const user = STATE.selectedUser;
  const text = document.getElementById("delete-popover-text");
  text.textContent =
    "¿Eliminar al usuario «" +
    user.name +
    "»? Esta acción no se puede deshacer.";
  getDeletePopover().showModal();
}

export function cancelDeleteConfirm() {
  resetDeleteConfirm();
}

export async function confirmDeleteSelectedUser() {
  if (STATE.isBusy || STATE.selectedUser === null) {
    return;
  }

  const user = STATE.selectedUser;
  const popover = getDeletePopover();
  const controls = document.querySelectorAll(
    "#edit-screen input, #edit-screen button, #delete-popover button",
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

    resetDeleteConfirm();
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

    if (popover.open) {
      popover.close();
    }
  }
}
