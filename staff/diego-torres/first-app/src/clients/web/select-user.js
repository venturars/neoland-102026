import { findUserById } from "../../logic/find-user-by-id.js";
import { showMessage } from "./show-message.js";
import { showUserMenu } from "./show-user-menu.js";
import { STATE } from "./state.js";

// Busca el usuario elegido en el desplegable y abre su menú.
export async function selectUser(event) {
  // Evita que el formulario recargue la página y no sigue si la app está ocupada.
  event.preventDefault();
  if (STATE.isBusy) {
    return;
  }

  // Bloquea el botón mientras se busca el usuario.
  const select = document.getElementById("user-select");
  const submit = document.getElementById("select-user");
  STATE.isBusy = true;
  submit.disabled = true;
  showMessage("", false);

  // Busca el usuario, lo guarda en el estado y abre su menú.
  try {
    STATE.selectedUser = await findUserById(select.value);
    showUserMenu();
  } catch (error) {
    // Si falla, muestra el error y sigue en la selección.
    showMessage(error.message, true);
  } finally {
    // Pase lo que pase, la app deja de estar ocupada y desbloquea el botón.
    STATE.isBusy = false;
    submit.disabled = false;
  }
}
