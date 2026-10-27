// AsistenciApp · página del alumno (T16 · CA-04 a CA-09; spec 007 · listas de grupo)
// Todo texto que viene del servidor o del usuario se pinta con textContent (CA-12).

const NAME_KEY = "asistenciapp.nombre";
const sessionId = new URLSearchParams(location.search).get("s");

const titleEl = document.getElementById("title");
const statusEl = document.getElementById("status");
const form = document.getElementById("form");
const nameInput = document.getElementById("name");
const codeInput = document.getElementById("code");
const submitButton = document.getElementById("submit");
const $ = (id) => document.getElementById(id);

const PASS_MS = 120_000; // spec 007, RF-11: el pase vale 2 minutos
const PASS_EXPIRED = "Ha pasado el tiempo: escribe el código que ves ahora en la pantalla del profesor.";

// Estado de la sesión con grupo. El pase vive solo en memoria, nunca en localStorage.
let pass = null;
let passTimer = null;
let roster = [];
let pending = null; // {name, isNew}: lo elegido o escrito, para no perderlo si caduca el pase (CA-16)

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
    // id y receipt sirven para saber si el profesor ha quitado el registro (spec 007, RF-17).
    localStorage.setItem(registrationKey(), JSON.stringify({
      name: data.name, checkedAt: data.checkedAt, id: data.id, receipt: data.receipt,
    }));
  } catch { /* sin almacenamiento: el límite no se aplica */ }
}
function forgetRegistration() {
  try { localStorage.removeItem(registrationKey()); } catch { /* nada que borrar */ }
}

// spec 007, CA-14: si el profesor quitó o liberó el registro, este navegador puede volver a registrarse.
// Las marcas antiguas, sin recibo, se quedan como estaban.
async function registrationStillExists(reg) {
  if (!reg.id || !reg.receipt) return true;
  try {
    const res = await fetch(
      `/api/s/${encodeURIComponent(sessionId)}/checkins/${encodeURIComponent(reg.id)}?r=${encodeURIComponent(reg.receipt)}`,
    );
    if (!res.ok) return true;
    return (await res.json()).exists;
  } catch {
    return true;
  }
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
      if (await registrationStillExists(reg)) {
        showAlreadyRegistered(reg); // CA-22
        return;
      }
      forgetRegistration();
    }
    if (!data.open) {
      showMessage("error", "La asistencia de esta clase ya está cerrada."); // CA-09
      return;
    }
    if (data.hasGroup) {
      showCodeStep();
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


// ---------- spec 007 · sesión con grupo ----------

// Misma normalización que name_key en el servidor: sin tildes, mayúsculas ni espacios extra.
function nameKey(name) {
  return name.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().split(/\s+/).filter(Boolean).join(" ");
}

function showCodeStep(message) {
  clearInterval(passTimer);
  pass = null;
  $("name-step").hidden = true;
  $("code-step").hidden = false;
  $("g-code").value = "";
  if (message) showMessage("error", message);
  $("g-code").focus();
}

function startPassTimer() {
  clearInterval(passTimer);
  const ends = Date.now() + PASS_MS;
  const paint = () => {
    const left = Math.max(0, Math.ceil((ends - Date.now()) / 1000));
    $("timer").textContent = `Tiempo para elegir: ${Math.floor(left / 60)}:${String(left % 60).padStart(2, "0")}`;
    if (left === 0) showCodeStep(PASS_EXPIRED); // CA-16
  };
  paint();
  passTimer = setInterval(paint, 1000);
}

function renderRoster() {
  const query = nameKey($("search").value);
  const shown = roster.filter((r) => nameKey(r.name).includes(query));
  $("roster").replaceChildren(...shown.map((r) => {
    const li = document.createElement("li");
    const b = document.createElement("button");
    b.type = "button";
    b.dataset.name = r.name;
    const name = document.createElement("span");
    name.textContent = r.name; // texto literal (CA-12)
    b.append(name);
    if (r.registered) {
      // RF-13: atenuado y no seleccionable
      b.disabled = true;
      const tag = document.createElement("span");
      tag.className = "tag";
      tag.textContent = "ya registrado";
      b.append(tag);
      b.setAttribute("aria-label", `${r.name}, ya registrado`);
    }
    li.append(b);
    return li;
  }));
  $("no-match").hidden = shown.length > 0;
}

async function refreshRoster() {
  try {
    const res = await fetch(`/api/s/${encodeURIComponent(sessionId)}/roster`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ pass }),
    });
    if (res.ok) {
      roster = (await res.json()).roster;
      renderRoster();
    }
  } catch { /* se queda la lista que había */ }
}

$("code-step").addEventListener("submit", async (event) => {
  event.preventDefault();
  showMessage("", "");
  const button = event.submitter;
  button.disabled = true;
  try {
    const res = await fetch(`/api/s/${encodeURIComponent(sessionId)}/unlock`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ code: $("g-code").value }),
    });
    const data = await res.json();
    if (!res.ok) {
      showMessage("error", data.error); // código malo, clase cerrada o IP bloqueada
      if (res.status === 409) $("code-step").hidden = true;
      else $("g-code").select();
      return;
    }
    pass = data.pass;
    roster = data.roster;
    $("code-step").hidden = true;
    $("name-step").hidden = false;
    $("similar").hidden = true;
    startPassTimer();
    // CA-16: recuperar lo que había elegido o escrito antes de que caducara el pase
    if (pending?.isNew) {
      $("search").value = "";
      $("new-form").hidden = false;
      $("new-name").value = pending.name;
      renderRoster();
      $("new-name").focus();
    } else {
      $("new-form").hidden = true;
      $("search").value = pending?.name || "";
      renderRoster();
      $("search").focus();
    }
  } catch {
    showMessage("error", "No se pudo conectar. Revisa tu conexión e inténtalo de nuevo.");
  } finally {
    button.disabled = false;
  }
});

$("search").addEventListener("input", renderRoster);

$("roster").addEventListener("click", (event) => {
  const b = event.target.closest("button[data-name]");
  if (b && !b.disabled) register(b.dataset.name, false, false);
});

$("not-listed").addEventListener("click", () => {
  $("new-form").hidden = false;
  if (!$("new-name").value) $("new-name").value = $("search").value;
  $("new-name").focus();
});

$("new-form").addEventListener("submit", (event) => {
  event.preventDefault();
  register($("new-name").value, true, false);
});

$("similar-yes").addEventListener("click", () => register($("similar-yes").dataset.name, false, false));
$("similar-no").addEventListener("click", () => register($("new-name").value, true, true));

async function register(name, isNew, confirmSimilar) {
  pending = { name, isNew };
  showMessage("", "");
  $("similar").hidden = true;
  try {
    const res = await fetch(`/api/s/${encodeURIComponent(sessionId)}/checkin`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ pass, name, isNew, confirmSimilar }),
    });
    const data = await res.json();
    if (res.status === 201) {
      clearInterval(passTimer);
      pending = null;
      rememberName(data.name);
      saveRegistration(data);
      $("name-step").hidden = true;
      showMessage("ok", `✓ Estás dentro, ${data.name} – ${hhmm(data.checkedAt)}`); // RF-16
      return;
    }
    if (res.status === 401) return showCodeStep(data.error); // pase caducado (CA-16)
    if (data.suggestion) {
      // RF-14: «¿Quisiste decir…?»
      $("similar-text").textContent = data.error;
      $("similar-yes").textContent = `Sí, soy ${data.suggestion}`;
      $("similar-yes").dataset.name = data.suggestion;
      $("similar").hidden = false;
      $("similar-yes").focus();
      return;
    }
    if (res.status === 409 && data.error.includes("La asistencia")) {
      $("name-step").hidden = true; // sesión cerrada
    }
    showMessage("error", data.error);
    await refreshRoster(); // nombre ya cogido: la lista se pone al día
  } catch {
    showMessage("error", "No se pudo conectar. Revisa tu conexión e inténtalo de nuevo.");
  }
}
