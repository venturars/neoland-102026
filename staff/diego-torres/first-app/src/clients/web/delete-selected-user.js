import { deleteUser } from "../../logic/delete-user.js";
import { loadUserSelection } from "./load-user-selection.js";
import { showMessage } from "./show-message.js";
import { STATE } from "./state.js";

export async function deleteSelectedUser() {
  const user = STATE.selectedUser;
  if (STATE.isBusy || user === null) {
    return;
  }
  if (!confirm(`¿Eliminar a ${user.name}?`)) {
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

  let borrado = false;
  try {
    await deleteUser(user.id);
    borrado = true;
  } catch (error) {
    showMessage(error.message, true);
  } finally {
    STATE.isBusy = false;
    for (const control of controls) {
      control.disabled = false;
    }
  }

  if (borrado) {
    await loadUserSelection();
    showMessage(`${user.name} se ha eliminado`, false);
  }
}
