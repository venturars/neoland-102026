import { api } from "./api.js";
import { state } from "./state.js";
import { showScreen, notice, busy } from "./show-screen.js";

// Un mismo formulario permite crear, consultar y modificar; borrar exige confirmar.
export function setupNoteEditor(showNotes, showUsers) {
  const form = document.getElementById("note-form");
  const deleteButton = document.getElementById("delete-note");
  document.getElementById("note-cancel").addEventListener("click", showNotes);
  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    await busy(form.querySelector('[type="submit"]'), async () => {
      const path = `/api/users/${state.userId}/notes${state.noteId === null ? "" : `/${state.noteId}`}`;
      try {
        await api(path, state.noteId === null ? "POST" : "PATCH", {
          title: document.getElementById("note-title").value,
          content: document.getElementById("note-content").value,
        });
        await showNotes();
        notice("Nota guardada.");
      } catch (error) { await handleMissing(error); }
    });
  });
  deleteButton.addEventListener("click", async () => {
    if (!window.confirm("Se eliminará esta nota. ¿Continuar?")) return;
    await busy(deleteButton, async () => {
      try { await api(`/api/users/${state.userId}/notes/${state.noteId}`, "DELETE"); await showNotes(); notice("Nota eliminada."); }
      catch (error) { await handleMissing(error); }
    });
  });
  async function handleMissing(error) {
    if (error.status === 404) {
      try { await api(`/api/users/${state.userId}`); await showNotes(); }
      catch { await showUsers(); }
    }
    notice(error.message);
  }
  return async function showNoteEditor(noteId) {
    state.noteId = noteId;
    if (noteId === null) {
      form.reset();
      document.getElementById("note-editor-title").textContent = "Nueva nota";
      document.getElementById("note-danger").hidden = true;
      showScreen("note-editor");
      return;
    }
    try {
      const note = await api(`/api/users/${state.userId}/notes/${noteId}`);
      document.getElementById("note-title").value = note.title;
      document.getElementById("note-content").value = note.content;
      document.getElementById("note-editor-title").textContent = `Nota #${note.id}`;
      document.getElementById("note-danger").hidden = false;
      showScreen("note-editor");
    } catch (error) { await handleMissing(error); }
  };
}
