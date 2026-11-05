// Canal para hablar con la extensión.
const vscode = acquireVsCodeApi();

// Devuelve un elemento de la pantalla por su id.
const byId = (id) => document.getElementById(id);

// Elementos que se usan más de una vez.
const message = byId("message");
const viewedUser = byId("viewed-user");
const userList = byId("user-list");
const deleteId = byId("delete-id");
const deleteConfirm = byId("delete-confirm");
const foundList = byId("found-users");
const genderButton = byId("gender-count");
const genderResult = byId("gender-result");

// Id que espera confirmación para borrarse.
let pendingDeleteId = "";

// Sube al principio: los avisos están arriba.
function scrollToTop() {
  document.documentElement.scrollTop = 0;
}

// Muestra un mensaje. Vacío, lo oculta.
function showMessage(text, isError) {
  message.textContent = text;
  message.classList.toggle("error", isError);
  message.hidden = text === "";
  if (text !== "") {
    scrollToTop();
  }
}

// Escribe los datos de un usuario en una línea.
function userText(user) {
  const { id, name, email, createdAt, updatedAt } = user;
  const dates = `creado ${createdAt} · modificado ${updatedAt}`;
  return `#${id} · ${name} — ${email} · ${dates}`;
}

// Enseña un usuario, o nada si no hay usuario.
function showViewedUser(user) {
  // Otra acción puede cambiar los usuarios: quita la búsqueda anterior.
  foundList.replaceChildren();
  // Otra acción puede cambiar los usuarios: quita el recuento anterior.
  genderResult.hidden = true;

  viewedUser.textContent = user === null ? "" : userText(user);
  viewedUser.hidden = user === null;
  if (user !== null) {
    scrollToTop();
  }
}

// Limpia la pantalla y envía una acción a la extensión.
function send(request) {
  showMessage("", false);
  showViewedUser(null);
  vscode.postMessage(request);
}

// Vacía los campos que se le indican.
function clearInputs(ids) {
  for (const id of ids) {
    byId(id).value = "";
  }
}

// Pinta la lista con textContent, porque viene de la base.
function showUsers(users) {
  userList.replaceChildren();
  for (const user of users) {
    const item = document.createElement("li");
    item.textContent = userText(user);
    userList.append(item);
  }
}

// Pinta los usuarios encontrados, o avisa si no hay ninguno.
function showFoundUsers(users) {
  // Una lista vacía no es un error: solo se avisa.
  if (users.length === 0) {
    showMessage("No hay usuarios con ese nombre", false);
    return;
  }

  // Se pinta con textContent, porque viene de la base.
  for (const user of users) {
    const item = document.createElement("li");
    item.textContent = userText(user);
    foundList.append(item);
  }
}

// Escribe los tres números del recuento en una línea.
function genderText(counts) {
  const { women, men, genderUndefined } = counts;
  return `Mujeres: ${women} · Hombres: ${men} · No definidos: ${genderUndefined}`;
}

// Atiende cada respuesta de la extensión.
function handleReply(event) {
  const { action, error, users, user, foundUsers, genderCount } = event.data;

  // Haya salido bien o mal, el botón del recuento vuelve a funcionar.
  if (action === "gender-count") {
    genderButton.disabled = false;
  }

  // Si falla, lo escrito se queda para corregirlo.
  if (error !== undefined) {
    showMessage(error, true);
    return;
  }
  if (users !== undefined) {
    showUsers(users);
  }
  if (user !== undefined) {
    showViewedUser(user);
  }
  if (foundUsers !== undefined) {
    showFoundUsers(foundUsers);
  }
  if (genderCount !== undefined) {
    showMessage("", false);
    genderResult.textContent = genderText(genderCount);
    genderResult.hidden = false;
  }

  // Si ha salido bien, vacía el formulario de esa acción.
  if (action === "create") {
    clearInputs(["create-name", "create-email"]);
  }
  if (action === "update") {
    clearInputs(["update-id", "update-name", "update-email"]);
  }
  if (action === "delete") {
    clearInputs(["delete-id"]);
  }
}

// Envía el alta con lo escrito.
function createFromForm(event) {
  event.preventDefault();
  const name = byId("create-name").value;
  const email = byId("create-email").value;
  send({ action: "create", name, email });
}

// Pide el usuario con el id escrito.
function viewFromForm(event) {
  event.preventDefault();
  send({ action: "view", id: byId("view-id").value });
}

// Envía solo los campos con texto. El resto se conserva.
function updateFromForm(event) {
  event.preventDefault();
  const changes = {};
  const name = byId("update-name").value;
  const email = byId("update-email").value;
  if (name !== "") {
    changes.name = name;
  }
  if (email !== "") {
    changes.email = email;
  }
  send({ action: "update", id: byId("update-id").value, changes });
}

// Pide confirmación, sin enviar nada todavía.
function askToDelete(event) {
  event.preventDefault();
  showMessage("", false);
  showViewedUser(null);
  pendingDeleteId = deleteId.value;
  const question = `¿Borrar el usuario ${pendingDeleteId}?`;
  byId("delete-question").textContent = question;
  deleteConfirm.hidden = false;
}

// Oculta la confirmación sin borrar nada.
function cancelDelete() {
  deleteConfirm.hidden = true;
  pendingDeleteId = "";
}

// Borra el usuario pendiente de confirmar.
function confirmDelete() {
  const id = pendingDeleteId;
  cancelDelete();
  send({ action: "delete", id });
}

// Pide el usuario con el email escrito.
function findByEmailFromForm(event) {
  event.preventDefault();
  send({ action: "find-by-email", email: byId("find-email").value });
}

// Pide los usuarios con el nombre escrito.
function findByNameFromForm(event) {
  event.preventDefault();
  send({ action: "find-by-name", name: byId("find-name").value });
}

// Pide el recuento por género a la extensión.
function countByGender() {
  send({ action: "gender-count" });

  // Desactiva el botón para no pedir dos recuentos a la vez.
  genderButton.disabled = true;

  // La IA puede tardar: avisa de que está trabajando.
  showMessage("Contando…", false);
}

// Conecta formularios, botones y respuestas.
byId("create-form").addEventListener("submit", createFromForm);
byId("view-form").addEventListener("submit", viewFromForm);
byId("update-form").addEventListener("submit", updateFromForm);
byId("delete-form").addEventListener("submit", askToDelete);
byId("delete-yes").addEventListener("click", confirmDelete);
byId("delete-no").addEventListener("click", cancelDelete);
byId("find-email-form").addEventListener("submit", findByEmailFromForm);
byId("find-name-form").addEventListener("submit", findByNameFromForm);
genderButton.addEventListener("click", countByGender);
window.addEventListener("message", handleReply);

// Al abrir la vista, pide la lista.
send({ action: "list" });
