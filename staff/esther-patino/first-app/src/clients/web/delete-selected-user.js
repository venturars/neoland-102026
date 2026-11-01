import { loadUserSelection } from "./load-user-selection.js";
import { showMessage } from "./show-message.js";
import { STATE } from "./state.js";

export async function deleteSelectedUser() {
  if (STATE.isBusy || STATE.selectedUser === null) {
    return;
  }

  const user = STATE.selectedUser;
  const confirmed = window.confirm(
    "¿Eliminar al usuario «" +
      user.name +
      "»? Esta acción no se puede deshacer.",
  );

  if (!confirmed) {
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

  try {
    const response = await fetch("/api/users/" + user.id, { method: "DELETE" });

    if (!response.ok) {
      const problem = await response.json();
      showMessage(problem.error, true);
      return;
    }

    await loadUserSelection();
  } catch {
    showMessage(
      "No se ha podido eliminar el usuario. Comprueba la conexión y vuelve a intentarlo.",
      true,
    );
  } finally {
    STATE.isBusy = false;

    for (const control of controls) {
      control.disabled = false;
    }
  }
}
