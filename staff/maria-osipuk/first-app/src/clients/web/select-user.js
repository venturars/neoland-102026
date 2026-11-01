import { showMessage } from "./show-message.js";
import { showUserMenu } from "./show-user-menu.js";
import { STATE } from "./state.js";

export async function selectUser(event) {
  event.preventDefault();

  if (STATE.isBusy) {
    return;
  }

  const select = document.getElementById("user-select");
  const id = select.value;

  if (id === "") {
    showMessage("Elige un usuario de la lista.", true);
    return;
  }

  STATE.isBusy = true;
  const controls = document.querySelectorAll(
    "#selection-screen select, #selection-screen button",
  );

  for (const control of controls) {
    control.disabled = true;
  }

  try {
    // Read the user again: the list may have been loaded before a deletion.
    const response = await fetch("/api/users/" + id);
    const user = await response.json();

    if (!response.ok) {
      showMessage(user.error, true);
      return;
    }

    STATE.selectedUser = user;
    showUserMenu();
  } catch {
    showMessage(
      "No se ha podido obtener el usuario. Vuelve a intentarlo.",
      true,
    );
  } finally {
    STATE.isBusy = false;

    for (const control of controls) {
      control.disabled = false;
    }
  }
}
