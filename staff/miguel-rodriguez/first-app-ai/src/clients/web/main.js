const selection = document.querySelector("#selection");
const menu = document.querySelector("#menu");
const editor = document.querySelector("#editor");
const message = document.querySelector("#message");
const users = document.querySelector("#users");
const form = document.querySelector("#user-form");
const nameInput = document.querySelector("#name");
const emailInput = document.querySelector("#email");
const storageKey = "first-app-contact-screens-v1";
const examples = [
  { id: 1, name: "Ada", email: "ada@example.test" },
  { id: 2, name: "Grace", email: "grace@example.test" },
  { id: 3, name: "Linus", email: "linus@example.test" },
];
let contacts = [];
let selectedUser = null;

function showMessage(text = "", isError = false) {
  message.textContent = text;
  message.dataset.error = String(isError);
}

function showScreen(screen) {
  selection.hidden = screen !== selection;
  menu.hidden = screen !== menu;
  editor.hidden = screen !== editor;
  const heading = screen.querySelector("h2");
  heading.tabIndex = -1;
  heading.focus();
}

function saveContacts(nextContacts) {
  try {
    window.localStorage.setItem(storageKey, JSON.stringify(nextContacts));
  } catch {
    showMessage(
      "El navegador no permite guardar. Los cambios se conservarán solo mientras esta página esté abierta.",
      true,
    );
  }
  contacts = nextContacts;
}

function showMenu(user) {
  selectedUser = user;
  document.querySelector("#menu-title").textContent =
    `${user.name} · ID ${user.id}`;
  document.querySelector("#selected-email").textContent = user.email;
  showScreen(menu);
}

function showUsers() {
  selectedUser = null;
  users.replaceChildren();
  showScreen(selection);
  for (const user of contacts) {
    const item = document.createElement("li");
    const button = document.createElement("button");
    const detail = document.createElement("span");
    button.type = "button";
    button.className = "user";
    button.append(document.createTextNode(`${user.name} · ID ${user.id}`));
    detail.textContent = user.email;
    button.append(detail);
    button.addEventListener("click", () => {
      showMessage();
      showMenu(user);
    });
    item.append(button);
    users.append(item);
  }
  if (!contacts.length)
    showMessage("No quedan contactos. Puedes restablecer los ejemplos.");
}

function loadContacts() {
  showMessage();
  try {
    const saved = window.localStorage.getItem(storageKey);
    const parsed =
      saved === null ? structuredClone(examples) : JSON.parse(saved);
    if (
      !Array.isArray(parsed) ||
      !parsed.every(
        (user) =>
          user &&
          Number.isSafeInteger(user.id) &&
          user.id > 0 &&
          typeof user.name === "string" &&
          typeof user.email === "string",
      ) ||
      new Set(parsed.map((user) => user.id)).size !== parsed.length
    ) {
      throw new Error("Invalid contacts");
    }
    contacts = parsed.sort((a, b) => a.id - b.id);
  } catch {
    contacts = structuredClone(examples);
    showMessage(
      "No se pudieron leer los contactos del navegador. Se muestran ejemplos; puedes restablecerlos.",
      true,
    );
  }
  showUsers();
}

form.addEventListener("submit", (event) => {
  event.preventDefault();
  if (!selectedUser) return;
  showMessage();
  const name = nameInput.value.trim();
  const email = emailInput.value.trim().toLowerCase();
  if (!name) {
    showMessage("Escribe un nombre.", true);
    nameInput.focus();
    return;
  }
  emailInput.value = email;
  if (!email || !emailInput.checkValidity()) {
    showMessage("Escribe un email válido.", true);
    emailInput.focus();
    return;
  }
  if (
    contacts.some(
      (user) =>
        user.id !== selectedUser.id && user.email.toLowerCase() === email,
    )
  ) {
    showMessage("Ese email ya pertenece a otro usuario.", true);
    emailInput.focus();
    return;
  }
  const updated = { ...selectedUser, name, email };
  saveContacts(
    contacts.map((user) => (user.id === updated.id ? updated : user)),
  );
  showMenu(updated);
});

document.querySelector("#edit").addEventListener("click", () => {
  if (!selectedUser) return;
  showMessage();
  nameInput.value = selectedUser.name;
  emailInput.value = selectedUser.email;
  showScreen(editor);
  nameInput.focus();
});
document.querySelector("#delete").addEventListener("click", () => {
  if (!selectedUser || !window.confirm(`¿Eliminar a ${selectedUser.name}?`))
    return;
  showMessage();
  saveContacts(contacts.filter((user) => user.id !== selectedUser.id));
  showUsers();
});
document.querySelector("#back").addEventListener("click", () => {
  showMessage();
  showUsers();
});
document.querySelector("#reload").addEventListener("click", loadContacts);
document.querySelector("#cancel").addEventListener("click", () => {
  showMessage();
  showMenu(selectedUser);
});
document.querySelector("#reset").addEventListener("click", () => {
  if (
    !window.confirm(
      "¿Restablecer los tres contactos de ejemplo? Se perderán los cambios de esta pantalla.",
    )
  )
    return;
  showMessage();
  saveContacts(structuredClone(examples));
  showUsers();
});
loadContacts();
