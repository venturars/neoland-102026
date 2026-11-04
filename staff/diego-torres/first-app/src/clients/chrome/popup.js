// Dirección de la API local de la extensión.
const ORIGIN = "http://127.0.0.1:3002";

// Elementos de la ventana que se usan más de una vez.
const message = document.getElementById("message");
const viewedUser = document.getElementById("viewed-user");
const userList = document.getElementById("user-list");
const createName = document.getElementById("create-name");
const createEmail = document.getElementById("create-email");
const viewId = document.getElementById("view-id");
const updateId = document.getElementById("update-id");
const updateName = document.getElementById("update-name");
const updateEmail = document.getElementById("update-email");
const deleteId = document.getElementById("delete-id");
const deleteConfirm = document.getElementById("delete-confirm");
const deleteQuestion = document.getElementById("delete-question");

// Id que espera confirmación para borrarse.
let pendingDeleteId = "";

// Sube al principio de la ventana: con una lista larga, los formularios quedan muy abajo.
function scrollToTopIf(hasSomethingToShow) {
  if (hasSomethingToShow) {
    document.documentElement.scrollTop = 0;
  }
}

// Muestra un mensaje, con estilo de error si isError es true. Vacío, lo oculta.
function showMessage(text, isError) {
  message.textContent = text;
  message.classList.toggle("error", isError);
  message.hidden = text === "";
  scrollToTopIf(text !== "");
}

// Escribe los datos de un usuario en una sola línea.
function userText(user) {
  return `#${user.id} · ${user.name} — ${user.email} · creado ${user.createdAt} · modificado ${user.updatedAt}`;
}

// Enseña un usuario debajo de los mensajes, o nada si no hay usuario.
function showViewedUser(user) {
  viewedUser.textContent = user === null ? "" : userText(user);
  viewedUser.hidden = user === null;
  scrollToTopIf(user !== null);
}

// Llama a la API y devuelve su respuesta. Si falla, lanza el mensaje que toca.
async function callApi(method, path, body, failureMessage) {
  let response;
  let result = null;

  // Si no se llega a la API, o responde algo que no es JSON, es un fallo de esa acción.
  try {
    const options = { method };
    if (body !== undefined) {
      options.headers = { "Content-Type": "application/json" };
      options.body = JSON.stringify(body);
    }
    response = await fetch(`${ORIGIN}${path}`, options);
    // Un 204 no trae cuerpo que leer.
    if (response.status !== 204) {
      result = await response.json();
    }
  } catch {
    throw new Error(failureMessage);
  }

  // Si la API responde con un error, se lanza su mensaje tal como llega.
  if (!response.ok) {
    throw new Error(result?.message ?? failureMessage);
  }
  return result;
}

// Convierte un id escrito a mano en una ruta segura.
function userPath(id) {
  return `/users/${encodeURIComponent(id)}`;
}

// Pide la lista de usuarios y la pinta.
async function showUsers() {
  try {
    const users = await callApi(
      "GET",
      "/users",
      undefined,
      "Could not list the users",
    );

    // Pinta cada usuario con textContent, porque viene de la base.
    userList.replaceChildren();
    for (const user of users) {
      const item = document.createElement("li");
      item.textContent = userText(user);
      userList.append(item);
    }
  } catch (error) {
    // Si falla, vacía la lista y muestra el error.
    userList.replaceChildren();
    showMessage(error.message, true);
  }
}

// Crea un usuario con lo escrito en su formulario.
async function createFromForm(event) {
  event.preventDefault();
  showMessage("", false);
  showViewedUser(null);

  try {
    await callApi(
      "POST",
      "/users",
      { name: createName.value, email: createEmail.value },
      "Could not create the user",
    );
  } catch (error) {
    // Si falla, lo escrito se queda para poder corregirlo.
    showMessage(error.message, true);
    return;
  }

  // Si se ha creado, vacía el formulario y actualiza la lista.
  createName.value = "";
  createEmail.value = "";
  await showUsers();
}

// Busca el usuario con el id escrito y lo enseña.
async function viewFromForm(event) {
  event.preventDefault();
  showMessage("", false);
  showViewedUser(null);

  try {
    const user = await callApi(
      "GET",
      userPath(viewId.value),
      undefined,
      "Could not find the user",
    );
    showViewedUser(user);
  } catch (error) {
    showMessage(error.message, true);
  }
}

// Modifica el usuario con el id escrito.
async function updateFromForm(event) {
  event.preventDefault();
  showMessage("", false);
  showViewedUser(null);

  // Solo se envía lo que tiene texto. Lo demás conserva su valor.
  const changes = {};
  if (updateName.value !== "") {
    changes.name = updateName.value;
  }
  if (updateEmail.value !== "") {
    changes.email = updateEmail.value;
  }

  let user;
  try {
    user = await callApi(
      "PATCH",
      userPath(updateId.value),
      changes,
      "Could not update the user",
    );
  } catch (error) {
    // Si falla, lo escrito se queda para poder corregirlo.
    showMessage(error.message, true);
    return;
  }

  // Enseña el usuario con los datos nuevos, vacía el formulario y actualiza la lista.
  showViewedUser(user);
  updateId.value = "";
  updateName.value = "";
  updateEmail.value = "";
  await showUsers();
}

// Pide confirmación antes de borrar, sin llamar todavía a la API.
function askToDelete(event) {
  event.preventDefault();
  showMessage("", false);
  showViewedUser(null);
  pendingDeleteId = deleteId.value;
  deleteQuestion.textContent = `¿Borrar el usuario ${pendingDeleteId}?`;
  deleteConfirm.hidden = false;
}

// Oculta la confirmación sin borrar nada.
function cancelDelete() {
  deleteConfirm.hidden = true;
  pendingDeleteId = "";
}

// Borra el usuario que estaba pendiente de confirmar.
async function confirmDelete() {
  // Oculta la confirmación primero, para no borrar dos veces con dos clics.
  const id = pendingDeleteId;
  cancelDelete();

  try {
    await callApi(
      "DELETE",
      userPath(id),
      undefined,
      "Could not delete the user",
    );
  } catch (error) {
    showMessage(error.message, true);
    return;
  }

  // Si se ha borrado, vacía el campo y actualiza la lista.
  deleteId.value = "";
  await showUsers();
}

// Conecta cada formulario y botón con la función que lo atiende.
document
  .getElementById("create-form")
  .addEventListener("submit", createFromForm);
document.getElementById("view-form").addEventListener("submit", viewFromForm);
document
  .getElementById("update-form")
  .addEventListener("submit", updateFromForm);
document.getElementById("delete-form").addEventListener("submit", askToDelete);
document.getElementById("delete-yes").addEventListener("click", confirmDelete);
document.getElementById("delete-no").addEventListener("click", cancelDelete);

// Al abrir la ventana, carga la lista.
showUsers();
