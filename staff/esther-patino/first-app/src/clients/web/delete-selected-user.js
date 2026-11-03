import { deleteUser } from "../../logic/delete-user.js";
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
    await deleteUser(user.id);
    await loadUserSelection();
  } catch (error) {
    const message = error instanceof Error ? error.message : "";
    const isLogicError =
      message === "Name is empty" ||
      message === "Email is invalid" ||
      message === "Email is already used" ||
      message === "Invalid id" ||
      message === "User not found";

    if (isLogicError) {
      showMessage(message, true);
      return;
    }

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
