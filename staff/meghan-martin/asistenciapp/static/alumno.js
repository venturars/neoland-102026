// AsistenciApp · página del alumno (T16 · CA-04 a CA-09)
// Todo texto que viene del servidor o del usuario se pinta con textContent (CA-12).

const NAME_KEY = "asistenciapp.nombre";
const sessionId = new URLSearchParams(location.search).get("s");

const titleEl = document.getElementById("title");
const statusEl = document.getElementById("status");
const form = document.getElementById("form");
const nameInput = document.getElementById("name");
const nameList = document.getElementById("names");
const codeInput = document.getElementById("code");
const submitButton = document.getElementById("submit");

let classNames = [];
let chosen = "";
let active = -1;

function fold(text) {
  return text.normalize("NFD").replace(/\p{M}/gu, "").toLowerCase().replace(/\s+/g, " ").trim();
}

function exactName(query) {
  const needle = fold(query);
  return classNames.find((name) => fold(name) === needle) || "";
}

function closeSuggestions() {
  nameList.replaceChildren();
  nameList.hidden = true;
  nameInput.setAttribute("aria-expanded", "false");
  nameInput.removeAttribute("aria-activedescendant");
  active = -1;
}

// Where the typed letters sit inside the real name, ignoring capitals and accents.
function matchSpan(name, needle) {
  let folded = "";
  const origin = [];
  for (let i = 0; i < name.length; i++) {
    const plain = name[i].normalize("NFD").replace(/\p{M}/gu, "").toLowerCase();
    for (const unit of plain) {
      if (unit === " " && (folded.endsWith(" ") || folded.length === 0)) continue;
      folded += unit;
      origin.push(i);
    }
  }
  const at = folded.trimEnd().indexOf(needle);
  if (at < 0) return null;
  return { start: origin[at], end: origin[at + needle.length - 1] + 1 };
}

function paintName(button, name, needle) {
  const span = matchSpan(name, needle);
  if (!span) {
    button.textContent = name;
    return;
  }
  button.append(document.createTextNode(name.slice(0, span.start)));
  const mark = document.createElement("mark");
  mark.textContent = name.slice(span.start, span.end);
  button.append(mark, document.createTextNode(name.slice(span.end)));
}

function rank(name, needle) {
  const folded = fold(name);
  if (folded.startsWith(needle)) return 0;
  const at = folded.indexOf(needle);
  if (at > 0 && folded[at - 1] === " ") return 1;
  return 2;
}

function pick(name) {
  chosen = name;
  nameInput.value = name;
  closeSuggestions();
  codeInput.focus();
}

function paintActive() {
  const options = [...nameList.querySelectorAll("[role='option']")];
  options.forEach((button, index) => {
    const on = index === active;
    button.setAttribute("aria-selected", on ? "true" : "false");
  });
  const current = options[active];
  if (!current) {
    nameInput.removeAttribute("aria-activedescendant");
    return;
  }
  nameInput.setAttribute("aria-activedescendant", current.id);
  current.scrollIntoView({ block: "nearest" });
}

function showNames(query) {
  const needle = fold(query);
  chosen = exactName(query);
  closeSuggestions();
  if (!needle || chosen) return;
  const found = classNames
    .map((name, order) => ({ name, order, score: rank(name, needle) }))
    .filter((item) => fold(item.name).includes(needle))
    .sort((a, b) => a.score - b.score || a.order - b.order)
    .map((item) => item.name);
  nameList.hidden = false;
  nameInput.setAttribute("aria-expanded", "true");
  if (!found.length) {
    const empty = document.createElement("li");
    empty.className = "muted small";
    empty.textContent = "Nadie coincide.";
    nameList.append(empty);
    return;
  }
  active = 0;
  found.forEach((name, index) => {
    const item = document.createElement("li");
    const button = document.createElement("button");
    button.type = "button";
    button.id = `name-opt-${index}`;
    button.setAttribute("role", "option");
    paintName(button, name, needle);
    button.addEventListener("mousedown", (event) => event.preventDefault());
    button.addEventListener("pointerenter", () => {
      active = index;
      paintActive();
    });
    button.addEventListener("click", () => pick(name));
    item.append(button);
    nameList.append(item);
  });
  paintActive();
}

function moveSuggestion(step) {
  const options = [...nameList.querySelectorAll("[role='option']")];
  if (!options.length) return;
  active = Math.min(options.length - 1, Math.max(0, active + step));
  paintActive();
}

function showMessage(kind, text) {
  statusEl.replaceChildren();
  if (!text) return;
  const p = document.createElement("p");
  p.className = `message ${kind}`;
  p.textContent = text;
  statusEl.append(p);
}

function hhmm(iso) {
  return new Date(iso).toLocaleTimeString("es-ES", { hour: "2-digit", minute: "2-digit" });
}

// Marca "ya me registré en ESTA clase" (CA-22, CA-23; plan §2.11).
// Vive solo en este navegador: es disuasoria, no una prueba de identidad.
function registrationKey() {
  return `asistenciapp.registro.${sessionId}`;
}
function savedRegistration() {
  try { return JSON.parse(localStorage.getItem(registrationKey())); } catch { return null; }
}
function saveRegistration(data) {
  try {
    localStorage.setItem(registrationKey(), JSON.stringify({ name: data.name, checkedAt: data.checkedAt }));
  } catch { /* sin almacenamiento: el límite no se aplica */ }
}
function showAlreadyRegistered(reg) {
  form.hidden = true;
  showMessage("ok", `Ya te registraste en esta clase como ${reg.name} a las ${hhmm(reg.checkedAt)}.`);
}

// El nombre se recuerda solo en este dispositivo, para la próxima clase.
// No se rellena el cuadro: el alumno lo busca y lo elige.
function rememberName(name) {
  try { localStorage.setItem(NAME_KEY, name); } catch { /* sin almacenamiento: no pasa nada */ }
}

async function loadSession() {
  if (!sessionId) {
    titleEl.textContent = "Enlace incompleto";
    showMessage("error", "Falta el identificador de la clase en el enlace. Pide el enlace a tu profesor.");
    return;
  }
  try {
    const res = await fetch(`/api/s/${encodeURIComponent(sessionId)}`);
    const data = await res.json();
    if (!res.ok) {
      titleEl.textContent = "Clase no encontrada";
      showMessage("error", data.error);
      return;
    }
    titleEl.textContent = data.title;
    const reg = savedRegistration();
    if (reg?.name && reg?.checkedAt) {
      showAlreadyRegistered(reg); // CA-22
      return;
    }
    if (!data.open) {
      showMessage("error", "La asistencia de esta clase ya está cerrada."); // CA-09
      return;
    }
    form.hidden = false;
    classNames = data.names || [];
    chosen = "";
    nameInput.value = "";
    closeSuggestions();
    nameInput.addEventListener("input", () => showNames(nameInput.value));
    nameInput.addEventListener("keydown", (event) => {
      const options = [...nameList.querySelectorAll("button")];
      if (event.key === "ArrowDown") {
        event.preventDefault();
        moveSuggestion(1);
      } else if (event.key === "ArrowUp") {
        event.preventDefault();
        moveSuggestion(-1);
      } else if (event.key === "Escape") {
        closeSuggestions();
      } else if (event.key === "Enter" && !nameList.hidden && options.length && active >= 0) {
        event.preventDefault();
        pick(options[active].textContent);
      }
    });
    nameInput.focus();
  } catch {
    titleEl.textContent = "Sin conexión";
    showMessage("error", "No se pudo conectar. Revisa tu conexión y recarga la página.");
  }
}

form.addEventListener("submit", async (event) => {
  event.preventDefault();
  if (!chosen) {
    showMessage("error", "Elige tu nombre de la lista.");
    nameInput.focus();
    return;
  }
  showMessage("", "");
  submitButton.disabled = true;
  try {
    const res = await fetch(`/api/s/${encodeURIComponent(sessionId)}/checkin`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: chosen, code: codeInput.value }),
    });
    const data = await res.json();

    if (res.status === 201) { // CA-04
      rememberName(data.name);
      saveRegistration(data);
      form.hidden = true;
      showMessage("ok", `¡Listo, ${data.name}! Registrado a las ${hhmm(data.checkedAt)}.`);
    } else if (res.ok && data.already) { // CA-07 (no marca el navegador: no se registró desde aquí)
      form.hidden = true;
      showMessage("ok", `Ya estabas registrado a las ${hhmm(data.checkedAt)}.`);
    } else if (res.status === 409) { // CA-09
      form.hidden = true;
      showMessage("error", data.error);
    } else { // CA-06, CA-08
      showMessage("error", data.error);
      (res.status === 400 ? nameInput : codeInput).select();
    }
  } catch {
    showMessage("error", "No se pudo conectar. Revisa tu conexión e inténtalo de nuevo.");
  } finally {
    submitButton.disabled = false;
  }
});

loadSession();
