import { showMessage } from "./show-message.js";
import { showUserMenu } from "./show-user-menu.js";
import { STATE } from "./state.js";

export async function saveUser(event) {
  event.preventDefault();

  if (STATE.isBusy || STATE.selectedUser === null) {
    return;
  }

  const nameInput = document.getElementById("user-name");
  const name = nameInput.value;
  const emailInput = document.getElementById("user-email");
  const email = emailInput.value;
  const id = STATE.selectedUser.id;
  const controls = document.querySelectorAll(
    "#edit-screen input, #edit-screen button",
  );
  STATE.isBusy = true;
  showMessage("", false);

  // Block repeated submissions and navigation until the request has finished.
  for (const control of controls) {
    control.disabled = true;
  }

  try {
    const body = JSON.stringify({ name: name, email: email });
    const response = await fetch("/api/users/" + id, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: body,
    });
    const user = await response.json();

    if (!response.ok) {
      // Keep the form unchanged so the rejected value can be corrected.
      showMessage(user.error, true);
      return;
    }

    STATE.selectedUser = user;
    showUserMenu();
    showMessage("Datos guardados.", false);
  } catch {
    showMessage(
      "No se ha podido guardar el usuario. Comprueba la conexión y vuelve a intentarlo.",
      true,
    );
  } finally {
    STATE.isBusy = false;

    for (const control of controls) {
      control.disabled = false;
    }
  }
}
