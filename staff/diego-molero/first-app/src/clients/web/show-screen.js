const screens = ["selection", "menu", "user-editor", "notes-list", "note-editor"];

// Oculta las demás pantallas y lleva el foco al título visible.
export function showScreen(name) {
  for (const id of screens) document.getElementById(id).hidden = id !== name;
  document.getElementById("notice").hidden = true;
  document.querySelector(`#${name} h2`).focus();
}

export function notice(message) {
  const target = document.getElementById("notice");
  target.textContent = message;
  target.hidden = false;
}

export async function busy(button, action) {
  const buttons = [...button.closest("section").querySelectorAll("button")];
  const previous = buttons.map((item) => item.disabled);
  buttons.forEach((item) => { item.disabled = true; });
  try { await action(); }
  finally { buttons.forEach((item, index) => { item.disabled = previous[index]; }); }
}
