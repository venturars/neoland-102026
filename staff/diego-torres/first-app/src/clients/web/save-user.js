import { updateUser } from "../../logic/update-user.js";
import { showMessage } from "./show-message.js";
import { showUserMenu } from "./show-user-menu.js";
import { STATE } from "./state.js";

export async function saveUser(event) {
  event.preventDefault();
  if (STATE.isBusy || STATE.selectedUser === null) {
    return;
  }

  const name = document.getElementById("user-name").value;
  const email = document.getElementById("user-email").value;
  const controls = document.querySelectorAll(
    "#edit-screen input, #edit-screen button",
  );
  STATE.isBusy = true;
  showMessage("", false);
  for (const control of controls) {
    control.disabled = true;
  }

  try {
    STATE.selectedUser = await updateUser(STATE.selectedUser.id, {
      name,
      email,
    });
    showUserMenu();
    showMessage("Datos guardados", false);
  } catch (error) {
    // El formulario se queda como estaba para corregir el dato.
    showMessage(error.message, true);
  } finally {
    STATE.isBusy = false;
    for (const control of controls) {
      control.disabled = false;
    }
  }
}
