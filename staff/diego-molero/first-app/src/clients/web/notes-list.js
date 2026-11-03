import { api } from "./api.js";
import { state } from "./state.js";
import { showScreen, notice } from "./show-screen.js";

// Cada nota del usuario ofrece consulta y edición desde su propia tarjeta.
export function setupNotesList(showMenu, showUsers, showNoteEditor) {
  document.getElementById("notes-back").addEventListener("click", showMenu);
  document.getElementById("new-note").addEventListener("click", () => showNoteEditor(null));
  document.getElementById("retry-notes").addEventListener("click", showNotes);
  async function showNotes() {
    showScreen("notes-list");
    const list = document.getElementById("notes");
    const retry = document.getElementById("retry-notes");
    list.textContent = "Cargando notas…";
    retry.hidden = true;
    try {
      const notes = await api(`/api/users/${state.userId}/notes`);
      list.replaceChildren();
      if (notes.length === 0) { list.textContent = "Aún no tienes notas. Crea la primera."; return; }
      for (const note of notes) {
        const card = document.createElement("article");
        card.className = "card";
        const heading = document.createElement("h3");
        heading.textContent = note.title;
        const id = document.createElement("p");
        id.className = "muted";
        id.textContent = `Nota #${note.id}`;
        const excerpt = document.createElement("p");
        excerpt.textContent = note.content;
        const date = document.createElement("p");
        date.className = "muted";
        date.textContent = new Intl.DateTimeFormat("es-ES", { dateStyle: "medium", timeStyle: "short" }).format(new Date(note.updatedAt));
        const button = document.createElement("button");
        button.type = "button";
        button.className = "secondary";
        button.textContent = `Ver o modificar nota #${note.id}`;
        button.addEventListener("click", () => showNoteEditor(note.id));
        card.append(heading, id, date, excerpt, button);
        list.append(card);
      }
    } catch (error) {
      if (error.status === 404) { await showUsers(); notice(error.message); }
      else { list.replaceChildren(); notice(error.message); retry.hidden = false; }
    }
  }
  return showNotes;
}
