import { findUserById } from "../../logic/find-user-by-id.js";
import { showMessage } from "./show-message.js";
import { showUserMenu } from "./show-user-menu.js";
import { STATE } from "./state.js";

export async function selectUser(event) {
  event.preventDefault();

  if (STATE.isBusy) {
    return;
  }

  const select = document.getElementById("user-select");
  const rawId = select.value;

  if (rawId === "") {
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
    const id = Number(rawId);
    const user = await findUserById(id);
    STATE.selectedUser = user;
    showUserMenu();
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
