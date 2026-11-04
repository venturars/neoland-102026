// Muestra una pantalla y oculta la otra.
import { showScreen } from "./show-screen.js";
// Datos compartidos: usuario abierto y si la app está ocupada.
import { STATE } from "./state.js";

// Abre la ficha con los datos del usuario y rellena su formulario.
export function showUser(user) {
  // Recuerda con qué usuario se está trabajando.
  STATE.currentUser = user;

  // Pinta los datos con textContent, porque vienen de la base.
  document.getElementById("detail-id").textContent = user.id;
  document.getElementById("detail-name").textContent = user.name;
  document.getElementById("detail-email").textContent = user.email;
  document.getElementById("detail-created").textContent = user.createdAt;
  document.getElementById("detail-updated").textContent = user.updatedAt;

  // Deja el formulario relleno con los datos actuales.
  document.getElementById("edit-name").value = user.name;
  document.getElementById("edit-email").value = user.email;

  showScreen("detail");
}
