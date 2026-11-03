import { showMessage } from "./show-message.js";
import { showUserMenu } from "./show-user-menu.js";
import { STATE } from "./state.js";

export async function selectUser(event) {
  event.preventDefault();
  if (STATE.isBusy) {
    return;
  }

  const select = document.getElementById("user-select");
  const submit = document.getElementById("select-user");
  const id = encodeURIComponent(select.value);
  STATE.isBusy = true;
  submit.disabled = true;
  showMessage("", false);

  try {
    const response = await fetch(`/api/users/${id}`);
    const user = await response.json();

    if (!response.ok) {
      showMessage(user.error, true);
      return;
    }

    STATE.selectedUser = user;
    showUserMenu();
  } catch {
    showMessage("No se ha podido conectar con la aplicación", true);
  } finally {
    STATE.isBusy = false;
    submit.disabled = false;
  }
}
