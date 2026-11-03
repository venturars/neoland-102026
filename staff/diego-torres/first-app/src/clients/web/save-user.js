import { showMessage } from "./show-message.js";
import { showUserMenu } from "./show-user-menu.js";
import { STATE } from "./state.js";

export async function saveUser(event) {
  event.preventDefault();
  if (STATE.isBusy || STATE.selectedUser === null) {
    return;
  }

  const nombre = document.getElementById("user-name").value;
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
    const id = encodeURIComponent(STATE.selectedUser.id);
    const response = await fetch(`/api/users/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ nombre, email }),
    });
    const user = await response.json();

    if (!response.ok) {
      showMessage(user.error, true);
      return;
    }

    STATE.selectedUser = user;
    showUserMenu();
    showMessage("Datos guardados", false);
  } catch {
    showMessage("No se ha podido conectar con la aplicación", true);
  } finally {
    STATE.isBusy = false;
    for (const control of controls) {
      control.disabled = false;
    }
  }
}
