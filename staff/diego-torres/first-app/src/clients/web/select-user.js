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
  const submit = document.getElementById("select-user");
  STATE.isBusy = true;
  submit.disabled = true;
  showMessage("", false);

  try {
    STATE.selectedUser = await findUserById(select.value);
    showUserMenu();
  } catch (error) {
    showMessage(error.message, true);
  } finally {
    STATE.isBusy = false;
    submit.disabled = false;
  }
}
