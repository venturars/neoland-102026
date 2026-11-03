import { showUsers } from "./user-selection.js";
import { showMenu } from "./user-menu.js";
import { setupUserEditor } from "./user-editor.js";
import { setupNotesList } from "./notes-list.js";
import { setupNoteEditor } from "./note-editor.js";

// Conecta las cinco pantallas sin guardar la selección fuera de la página.
const users = () => showUsers(menu);
const menu = () => showMenu(users);
let showNotes;
const showNoteEditor = setupNoteEditor(() => showNotes(), users);
showNotes = setupNotesList(menu, users, showNoteEditor);
const showUserEditor = setupUserEditor(menu, users);
document.getElementById("retry-users").addEventListener("click", users);
document.getElementById("menu-back").addEventListener("click", users);
document.getElementById("menu-edit").addEventListener("click", showUserEditor);
document.getElementById("menu-notes").addEventListener("click", showNotes);
users();
