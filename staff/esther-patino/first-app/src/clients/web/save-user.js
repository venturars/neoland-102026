import { updateUser } from "../../logic/update-user.js";
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

  for (const control of controls) {
    control.disabled = true;
  }

  try {
    const user = await updateUser(id, { name: name, email: email });
    STATE.selectedUser = user;
    showUserMenu();
    showMessage("Datos guardados.", false);
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
