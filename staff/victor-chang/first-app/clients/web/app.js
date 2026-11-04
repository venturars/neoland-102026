import { listUsers } from "/logic/list-users.js";
import { searchUsers } from "/logic/search-users.js";
import { getUser } from "/logic/get-user.js";
import { createUser } from "/logic/create-user.js";
import { updateUser } from "/logic/update-user.js";
import { deleteUser } from "/logic/delete-user.js";
import { load, dump } from "./queries.js";

const UNSUPPORTED =
  "This browser cannot open the database. Use Chrome or Edge.";
const DENIED = "Access to users.sqlite was denied.";
const READ_FAILED = "Could not read users.sqlite.";
const SAVE_FAILED = "Could not save users.sqlite.";

const HANDLE_DB = "first-app-web";
const HANDLE_STORE = "handles";
const HANDLE_KEY = "users.sqlite";

const $ = (id) => document.getElementById(id);

const openScreen = $("open-screen");
const openButton = $("open-button");
const openMessage = $("open-message");
const listScreen = $("list-screen");
const searchInput = $("search-input");
const userList = $("user-list");
const listEmpty = $("list-empty");
const indexBar = $("index-bar");
const cardScreen = $("card-screen");
const userSheet = $("user-sheet");
const userForm = $("user-form");
const nameInput = $("name-input");
const emailInput = $("email-input");
const deleteSheet = $("delete-sheet");
const alertBox = $("alert-box");

let handle = null;
let currentId = null;
let sheetMode = "new";

// The file handle

function openHandleStore() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(HANDLE_DB, 1);
    request.onupgradeneeded = () =>
      request.result.createObjectStore(HANDLE_STORE);
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

async function readHandle() {
  try {
    const store = await openHandleStore();
    return await new Promise((resolve, reject) => {
      const request = store
        .transaction(HANDLE_STORE)
        .objectStore(HANDLE_STORE)
        .get(HANDLE_KEY);
      request.onsuccess = () => resolve(request.result ?? null);
      request.onerror = () => reject(request.error);
    });
  } catch (error) {
    // Without a remembered handle, the page asks for the file again
    console.warn(error);
    return null;
  }
}

async function rememberHandle(fileHandle) {
  try {
    const store = await openHandleStore();
    store
      .transaction(HANDLE_STORE, "readwrite")
      .objectStore(HANDLE_STORE)
      .put(fileHandle, HANDLE_KEY);
  } catch (error) {
    // Not remembering the file only means choosing it again next time
    console.warn(error);
  }
}

// Each step: read the file, run logic/, save the file after a change

async function step(work, { save = false } = {}) {
  try {
    const file = await handle.getFile();
    load(new Uint8Array(await file.arrayBuffer()));
  } catch (error) {
    console.error(error);
    showAlert(READ_FAILED);
    return { ok: false };
  }

  let value;
  try {
    value = work();
  } catch (error) {
    return { ok: false, error };
  }

  if (save) {
    try {
      const writable = await handle.createWritable();
      await writable.write(dump());
      await writable.close();
    } catch (error) {
      console.error(error);
      showAlert(SAVE_FAILED);
      return { ok: false };
    }
  }

  return { ok: true, value };
}

// Screens

function show(screen) {
  for (const each of [openScreen, listScreen, cardScreen]) {
    each.hidden = each !== screen;
  }
  window.scrollTo(0, 0);
}

function showAlert(message, onClose) {
  $("alert-message").textContent = message;
  alertBox.onclose = () => {
    alertBox.onclose = null;
    onClose?.();
  };
  alertBox.showModal();
}

function initials(name) {
  const words = name.trim().split(/\s+/).filter(Boolean);
  if (words.length === 0) {
    return "";
  }
  const first = Array.from(words[0])[0];
  const last = words.length > 1 ? Array.from(words.at(-1))[0] : "";
  return (first + last).toUpperCase();
}

function sectionOf(name) {
  const letter = name
    .trim()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .charAt(0)
    .toUpperCase();
  return /[A-Z]/.test(letter) ? letter : "#";
}

function avatar(name, className = "avatar") {
  const circle = document.createElement("div");
  circle.className = className;
  circle.textContent = initials(name);
  circle.setAttribute("aria-hidden", "true");
  return circle;
}

// A user that cannot be found any more takes the page back to the list
function showFailure(error) {
  if (error.code === "NOT_FOUND") {
    showAlert(error.message, () => {
      userSheet.close();
      deleteSheet.close();
      showList();
    });
    return;
  }
  showAlert(error.message);
}

// List

async function showList() {
  const text = searchInput.value;
  const result = await step(() =>
    text.trim() ? searchUsers(text) : listUsers(),
  );
  show(listScreen);
  if (!result.ok) {
    if (result.error) {
      showFailure(result.error);
    }
    return;
  }
  renderList(result.value, text.trim());
}

function renderList(users, text) {
  const sorted = users.toSorted(
    (a, b) =>
      a.name.localeCompare(b.name, undefined, { sensitivity: "base" }) ||
      a.id - b.id,
  );

  const sections = new Map();
  for (const user of sorted) {
    const letter = sectionOf(user.name);
    if (!sections.has(letter)) {
      sections.set(letter, []);
    }
    sections.get(letter).push(user);
  }
  const letters = [...sections.keys()].sort((a, b) =>
    a === "#" ? 1 : b === "#" ? -1 : a.localeCompare(b),
  );

  userList.replaceChildren();
  indexBar.replaceChildren();

  for (const letter of letters) {
    const section = document.createElement("section");
    section.id = `section-${letter === "#" ? "other" : letter}`;

    const header = document.createElement("h3");
    header.className = "section-header";
    header.textContent = letter;
    section.append(header);

    for (const user of sections.get(letter)) {
      const row = document.createElement("button");
      row.type = "button";
      row.className = "user-row";
      row.dataset.id = user.id;
      const name = document.createElement("span");
      name.className = "row-name";
      name.textContent = user.name;
      row.append(avatar(user.name), name);
      section.append(row);
    }
    userList.append(section);

    const link = document.createElement("a");
    link.href = `#${section.id}`;
    link.textContent = letter;
    indexBar.append(link);
  }

  listEmpty.hidden = users.length > 0;
  listEmpty.textContent = text ? `No Results for “${text}”` : "No Users";
  indexBar.hidden = users.length === 0;
}

// Card

async function showCard(id) {
  const result = await step(() => getUser(id));
  if (!result.ok) {
    if (result.error) {
      showFailure(result.error);
    }
    return;
  }
  renderCard(result.value);
  show(cardScreen);
}

function renderCard(user) {
  currentId = user.id;
  const circle = $("card-avatar");
  circle.textContent = initials(user.name);
  $("card-name").textContent = user.name;
  const email = $("card-email");
  email.textContent = user.email;
  email.href = `mailto:${user.email}`;
  $("card-dates").textContent =
    `Created ${user.createdAt}. Last updated ${user.updatedAt}.`;
}

// Sheet

function clearFieldErrors() {
  for (const field of ["name", "email"]) {
    const message = $(`${field}-error`);
    message.hidden = true;
    message.textContent = "";
  }
}

function openSheet(user) {
  sheetMode = user ? "edit" : "new";
  $("sheet-title").textContent = user ? "Edit User" : "New User";
  nameInput.value = user?.name ?? "";
  emailInput.value = user?.email ?? "";
  $("sheet-avatar").textContent = initials(nameInput.value);
  $("delete-group").hidden = !user;
  clearFieldErrors();
  userSheet.showModal();
  nameInput.focus();
}

async function saveSheet() {
  clearFieldErrors();
  const name = nameInput.value;
  const email = emailInput.value;
  const id = currentId;

  const result = await step(
    () =>
      sheetMode === "new"
        ? createUser(name, email)
        : updateUser(id, name, email),
    { save: true },
  );

  if (!result.ok) {
    const field = result.error?.details?.field;
    if (field === "name" || field === "email") {
      const message = $(`${field}-error`);
      message.textContent = result.error.message;
      message.hidden = false;
      $(`${field}-input`).focus();
    } else if (result.error) {
      showFailure(result.error);
    }
    return;
  }

  userSheet.close();
  renderCard(result.value);
  show(cardScreen);
}

async function confirmDelete() {
  const id = currentId;
  const result = await step(() => deleteUser(id), { save: true });
  deleteSheet.close();
  if (!result.ok) {
    if (result.error) {
      showFailure(result.error);
    }
    return;
  }
  userSheet.close();
  currentId = null;
  await showList();
}

// Opening the file

async function openFile() {
  openMessage.hidden = true;

  if (!handle) {
    try {
      [handle] = await window.showOpenFilePicker({
        types: [
          {
            description: "SQLite database",
            accept: { "application/vnd.sqlite3": [".sqlite"] },
          },
        ],
      });
    } catch (error) {
      // Closing the file picker is not a failure
      if (error.name !== "AbortError") {
        console.error(error);
        showAlert(READ_FAILED);
      }
      return;
    }
  }

  let permission;
  try {
    permission = await handle.requestPermission({ mode: "readwrite" });
  } catch (error) {
    console.error(error);
    permission = "denied";
  }
  if (permission !== "granted") {
    showAlert(DENIED);
    return;
  }

  await rememberHandle(handle);
  await showList();
}

async function start() {
  if (!("showOpenFilePicker" in window)) {
    openButton.hidden = true;
    openMessage.textContent = UNSUPPORTED;
    openMessage.hidden = false;
    show(openScreen);
    return;
  }

  handle = await readHandle();
  if (
    handle &&
    (await handle.queryPermission({ mode: "readwrite" })) === "granted"
  ) {
    await showList();
    return;
  }
  show(openScreen);
}

openButton.addEventListener("click", openFile);
$("add-button").addEventListener("click", () => openSheet(null));
searchInput.addEventListener("input", showList);
userList.addEventListener("click", (event) => {
  const row = event.target.closest(".user-row");
  if (row) {
    showCard(Number(row.dataset.id));
  }
});
$("back-button").addEventListener("click", showList);
$("edit-button").addEventListener("click", async () => {
  const result = await step(() => getUser(currentId));
  if (!result.ok) {
    if (result.error) {
      showFailure(result.error);
    }
    return;
  }
  openSheet(result.value);
});
nameInput.addEventListener("input", () => {
  $("sheet-avatar").textContent = initials(nameInput.value);
});
userForm.addEventListener("submit", (event) => {
  event.preventDefault();
  saveSheet();
});
$("cancel-button").addEventListener("click", () => userSheet.close());
$("delete-button").addEventListener("click", () => deleteSheet.showModal());
$("confirm-delete-button").addEventListener("click", confirmDelete);
$("keep-button").addEventListener("click", () => deleteSheet.close());
$("alert-ok-button").addEventListener("click", () => alertBox.close());

start();
