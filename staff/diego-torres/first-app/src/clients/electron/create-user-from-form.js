// Crea un usuario en la base (viene de la capa de lógica).
import { createUser } from "../../logic/create-user.js";
// Abre la pantalla de la lista y carga los usuarios.
import { loadUsers } from "./load-users.js";
// Muestra mensajes en pantalla, normales o de error.
import { showMessage } from "./show-message.js";
// Datos compartidos: usuario abierto y si la app está ocupada.
import { STATE } from "./state.js";

// Crea un usuario con lo escrito en el formulario de alta.
export async function createUserFromForm(event) {
  // Evita que el formulario recargue la página y no sigue si la app está ocupada.
  event.preventDefault();
  if (STATE.isBusy) {
    return;
  }

  // Lee lo escrito en el formulario.
  const nameInput = document.getElementById("create-name");
  const emailInput = document.getElementById("create-email");
  STATE.isBusy = true;
  showMessage("", false);

  // Intenta crearlo y apunta si ha salido bien.
  let creado = false;
  try {
    await createUser({ name: nameInput.value, email: emailInput.value });
    creado = true;
  } catch (error) {
    // Si falla, lo escrito se queda para poder corregirlo.
    showMessage(error.message, true);
  } finally {
    // Pase lo que pase, la app deja de estar ocupada.
    STATE.isBusy = false;
  }

  // Si se ha creado, vacía el formulario y vuelve a cargar la lista.
  if (creado) {
    nameInput.value = "";
    emailInput.value = "";
    await loadUsers();
  }
}
