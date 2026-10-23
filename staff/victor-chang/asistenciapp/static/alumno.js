// AsistenciApp · página del alumno (spec 001 · T16 · CA-04 a CA-09; spec 005 · T16)
// Todo texto que viene del servidor o del usuario se pinta con textContent (CA-12; ARCHITECTURE U2).

const NAME_KEY = "asistenciapp.nombre";
const NO_CONNECTION = "No se pudo conectar. Revisa tu conexión e inténtalo de nuevo.";
const UNEXPECTED = "Error inesperado. Inténtalo de nuevo en unos segundos.";
// Mismo texto que SessionClosedError (attendance/domain/errors.py): aquí se usa al abrir la página.
const CLOSED = "La asistencia de esta clase ya está cerrada. Si acabas de llegar, avisa al profesor.";
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

// Única forma de hablar con el servidor (ARCHITECTURE U3). Devuelve { status, ok, data }.
// Sin conexión, o si la respuesta no es JSON, lanza un Error con un mensaje para el alumno.
async function api(path, options = {}) {
  let res;
  try {
    res = await fetch(path, { ...options, headers: { "Content-Type": "application/json", ...options.headers } });
  } catch {
    throw new Error(NO_CONNECTION);
  }
  try {
    return { status: res.status, ok: res.ok, data: await res.json() };
  } catch {
    throw new Error(UNEXPECTED);
  }
}

async function loadSession() {
  if (!sessionId) {
    titleEl.textContent = "Enlace incompleto";
    showMessage("error", "Falta el identificador de la clase en el enlace. Pide el enlace a tu profesor.");
    return;
  }
  try {
    const { ok, data } = await api(`/api/s/${encodeURIComponent(sessionId)}`);
    if (!ok) {
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
      showMessage("error", CLOSED); // CA-09
      return;
    }
    form.hidden = false;
    nameInput.value = rememberedName();
    (nameInput.value ? codeInput : nameInput).focus();
  } catch (error) {
    titleEl.textContent = "Sin conexión";
    showMessage("error", error.message);
  }
}

form.addEventListener("submit", async (event) => {
  event.preventDefault();
  showMessage("", "");
  submitButton.disabled = true;
  try {
    const { status, ok, data } = await api(`/api/s/${encodeURIComponent(sessionId)}/checkin`, {
      method: "POST",
      body: JSON.stringify({ name: nameInput.value, code: codeInput.value }),
    });

    if (status === 201) { // CA-04
      rememberName(data.name);
      saveRegistration(data);
      form.hidden = true;
      showMessage("ok", `¡Listo, ${data.name}! Registrado a las ${hhmm(data.checkedAt)}.`);
    } else if (ok && data.already) { // CA-07 (no marca el navegador: no se registró desde aquí)
      form.hidden = true;
      showMessage("ok", `Ya estabas registrado a las ${hhmm(data.checkedAt)}.`);
    } else if (status === 409) { // CA-09
      form.hidden = true;
      showMessage("error", data.error);
    } else { // CA-06, CA-08
      showMessage("error", data.error);
      (status === 400 ? nameInput : codeInput).select();
    }
  } catch (error) {
    showMessage("error", error.message);
  } finally {
    submitButton.disabled = false;
  }
});

loadSession();
