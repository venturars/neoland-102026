// AsistenciApp · página del alumno (T16 · CA-04 a CA-09)
// Todo texto que viene del servidor o del usuario se pinta con textContent (CA-12).

const NAME_KEY = "asistenciapp.nombre";
const sessionId = new URLSearchParams(location.search).get("s");

const titleEl = document.getElementById("title");
const statusEl = document.getElementById("status");
const form = document.getElementById("form");
const nameInput = document.getElementById("name");
const codeInput = document.getElementById("code");
const submitButton = document.getElementById("submit");

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
function rememberedName() {
  try { return localStorage.getItem(NAME_KEY) || ""; } catch { return ""; }
}
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
    nameInput.value = rememberedName();
    (nameInput.value ? codeInput : nameInput).focus();
  } catch {
    titleEl.textContent = "Sin conexión";
    showMessage("error", "No se pudo conectar. Revisa tu conexión y recarga la página.");
  }
}

form.addEventListener("submit", async (event) => {
  event.preventDefault();
  showMessage("", "");
  submitButton.disabled = true;
  try {
    const res = await fetch(`/api/s/${encodeURIComponent(sessionId)}/checkin`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: nameInput.value, code: codeInput.value }),
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
