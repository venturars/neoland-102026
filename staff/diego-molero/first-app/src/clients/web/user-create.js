import { api } from "./api.js";
import { showScreen, notice, busy } from "./show-screen.js";

// El formulario permite dar de alta un usuario sin salir del cliente web.
export function setupUserCreate(showUsers) {
  const form = document.getElementById("create-user-form");
  document.getElementById("create-user-cancel").addEventListener("click", showUsers);
  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    await busy(form.querySelector('[type="submit"]'), async () => {
      try {
        const user = await api("/api/users", "POST", {
          name: document.getElementById("create-user-name").value,
          email: document.getElementById("create-user-email").value,
        });
        await showUsers();
        notice(`Usuario #${user.id} creado. Ya puedes seleccionarlo.`);
      } catch (error) {
        notice(error.message);
      }
    });
  });
  return function showUserCreate() {
    form.reset();
    showScreen("user-create");
  };
}
