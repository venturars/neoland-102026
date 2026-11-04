import { api } from "./api.js";
import { state } from "./state.js";
import { showScreen, notice, busy } from "./show-screen.js";

// Rellena el formulario desde la API y confirma el borrado conjunto de notas.
export function setupUserEditor(showMenu, showUsers) {
  const form = document.getElementById("user-form");
  const deleteButton = document.getElementById("delete-user");
  document.getElementById("user-cancel").addEventListener("click", showMenu);
  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    await busy(form.querySelector('[type="submit"]'), async () => {
      try {
        await api(`/api/users/${state.userId}`, "PATCH", {
          name: document.getElementById("user-name").value,
          email: document.getElementById("user-email").value,
        });
        await showMenu();
        notice("Usuario actualizado.");
      } catch (error) { if (error.status === 404) await showUsers(); notice(error.message); }
    });
  });
  deleteButton.addEventListener("click", async () => {
    if (!window.confirm("Se eliminarán este usuario y todas sus notas. ¿Continuar?")) return;
    await busy(deleteButton, async () => {
      try { await api(`/api/users/${state.userId}`, "DELETE"); await showUsers(); notice("Usuario y notas eliminados."); }
      catch (error) { if (error.status === 404) await showUsers(); notice(error.message); }
    });
  });
  return async function showUserEditor() {
    try {
      const user = await api(`/api/users/${state.userId}`);
      document.getElementById("user-name").value = user.name;
      document.getElementById("user-email").value = user.email;
      showScreen("user-editor");
    } catch (error) { if (error.status === 404) await showUsers(); notice(error.message); }
  };
}
