// AsistenciApp · panel del profesor (T17 panel · T18 vista de sesión)
// El token va en el fragmento (#t=…): el navegador nunca lo envía en la URL (plan §2.2).
// La navegación también usa el fragmento: #t=<token> (panel) y #t=<token>&s=<id> (sesión).
// Todo texto que viene del servidor se pinta con textContent (CA-12).

const POLL_MS = 2000; // CA-10: la lista se actualiza en ≤ 5 s

const $ = (id) => document.getElementById(id);
const statusEl = $("status");
const views = { panel: $("panel-view"), session: $("session-view") };

let pollTimer = null;
let countdownTimer = null;
let currentSession = null;
let pendingRemoval = null; // id del registro que espera confirmación (CA-24)
let renderedListKey = ""; // para no repintar la lista si no ha cambiado

// ---------- utilidades ----------

function hashParams() {
  return new URLSearchParams(location.hash.slice(1));
}

function token() {
  return hashParams().get("t") || "";
}

function hrefFor(sessionId) {
  const params = new URLSearchParams({ t: token() });
  if (sessionId) params.set("s", sessionId);
  return `#${params}`;
}

function showMessage(kind, text) {
  statusEl.replaceChildren();
  if (!text) return;
  const p = document.createElement("p");
  p.className = `message ${kind}`;
  p.textContent = text;
  statusEl.append(p);
}

function showView(name) {
  for (const [key, el] of Object.entries(views)) el.hidden = key !== name;
}

function hhmm(iso) {
  return new Date(iso).toLocaleTimeString("es-ES", { hour: "2-digit", minute: "2-digit" });
}

function dateTime(iso) {
  return new Date(iso).toLocaleString("es-ES", { dateStyle: "short", timeStyle: "short" });
}

class AuthError extends Error {}

async function api(path, options = {}) {
  const res = await fetch(path, {
    ...options,
    headers: { "X-Teacher-Token": token(), "Content-Type": "application/json", ...options.headers },
  });
  if (res.status === 401) throw new AuthError();
  return res;
}

function handleError(error) {
  stopTimers();
  if (error instanceof AuthError) {
    showView(null);
    showMessage("error", "Enlace del panel no válido. Abre el enlace exacto que aparece en la terminal al arrancar la app.");
  } else {
    showMessage("error", "No se pudo conectar con la app. ¿Sigue arrancada en tu ordenador?");
  }
}

function stopTimers() {
  clearTimeout(pollTimer);
  clearInterval(countdownTimer);
  pollTimer = countdownTimer = null;
}

// ---------- panel (T17) ----------

async function renderBlockedIps() {
  const rows = await (await api("/api/blocked-ips")).json();
  const list = $("blocked-list");
  list.replaceChildren();
  $("no-blocked").hidden = rows.length > 0;
  $("unblock-all").hidden = rows.length === 0;
  for (const row of rows) {
    const li = document.createElement("li");
    const info = document.createElement("div");
    info.className = "info";
    const ipEl = document.createElement("strong");
    ipEl.textContent = row.ip;
    const meta = document.createElement("div");
    meta.className = "muted small";
    meta.textContent = `Bloqueada ${dateTime(row.blockedAt)}`;
    info.append(ipEl, meta);
    const remove = document.createElement("button");
    remove.type = "button";
    remove.className = "secondary";
    remove.textContent = "Quitar";
    remove.addEventListener("click", async () => {
      remove.disabled = true;
      try {
        const res = await api(`/api/blocked-ips/${encodeURIComponent(row.ip)}`, { method: "DELETE" });
        if (!res.ok) throw new Error("unblock");
        await renderBlockedIps();
      } catch (error) {
        handleError(error);
      } finally {
        remove.disabled = false;
      }
    });
    li.append(info, remove);
    list.append(li);
  }
}

$("unblock-all").addEventListener("click", async () => {
  const button = $("unblock-all");
  button.disabled = true;
  try {
    const res = await api("/api/blocked-ips", { method: "DELETE" });
    if (!res.ok) throw new Error("unblock-all");
    await renderBlockedIps();
  } catch (error) {
    handleError(error);
  } finally {
    button.disabled = false;
  }
});

async function renderPanel() {
  showView("panel");
  document.title = "Panel del profesor · AsistenciApp";
  await renderBlockedIps();
  const sessions = await (await api("/api/sessions")).json(); // CA-16

  const list = $("sessions");
  list.replaceChildren();
  $("no-sessions").hidden = sessions.length > 0;
  list.hidden = sessions.length === 0;

  for (const s of sessions) {
    const li = document.createElement("li");

    const info = document.createElement("div");
    info.className = "info";
    const title = document.createElement("strong");
    title.textContent = s.title;
    const badge = document.createElement("span");
    badge.className = s.closedAt ? "badge closed" : "badge";
    badge.textContent = s.closedAt ? "cerrada" : "abierta";
    const meta = document.createElement("div");
    meta.className = "muted small";
    meta.textContent = `${dateTime(s.openedAt)} · ${s.total} ${s.total === 1 ? "asistente" : "asistentes"}`;
    info.append(title, badge, meta);

    const buttons = document.createElement("div");
    buttons.className = "buttons";
    const open = document.createElement("a");
    open.className = "button secondary";
    open.href = hrefFor(s.id);
    open.textContent = "Ver";
    const download = document.createElement("button");
    download.type = "button";
    download.className = "secondary";
    download.textContent = "Descargar lista";
    download.addEventListener("click", () => downloadCsv(s.id).catch(handleError));
    buttons.append(open, download);

    li.append(info, buttons);
    list.append(li);
  }
}

$("new-session").addEventListener("submit", async (event) => {
  event.preventDefault();
  const button = event.submitter;
  button.disabled = true;
  try {
    const res = await api("/api/sessions", {
      method: "POST",
      body: JSON.stringify({ title: $("session-title").value }),
    }); // CA-01, CA-02
    const session = await res.json();
    $("session-title").value = "";
    location.hash = hrefFor(session.id);
  } catch (error) {
    handleError(error);
  } finally {
    button.disabled = false;
  }
});

// ---------- descarga (CA-14) ----------

async function downloadCsv(sessionId) {
  const res = await api(`/api/sessions/${encodeURIComponent(sessionId)}/export`);
  if (!res.ok) throw new Error("export");
  const blob = await res.blob();
  const filename =
    /filename="([^"]+)"/.exec(res.headers.get("Content-Disposition") || "")?.[1] || "asistencia.xlsx";
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.append(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

// ---------- vista de sesión (T18) ----------

function renderSession(data) {
  currentSession = data;
  document.title = `${data.title} · AsistenciApp`;
  $("s-title").textContent = data.title;
  $("s-link").textContent = data.studentUrl;

  // Código y cuenta atrás (CA-03), o aviso de cerrada (CA-13)
  $("code-card").hidden = !data.open;
  $("s-closed").hidden = data.open;
  $("close").hidden = !data.open;
  if (data.open) {
    $("s-code").textContent = data.code;
    startCountdown(data.secondsLeft);
  }

  renderList(data);
}

// Lista en vivo y total (CA-10, CA-11) con botón "Quitar" (CA-24).
// Solo se repinta si algo cambió: así no se pierde el foco del teclado cada 2 s (P5)
// y la confirmación pendiente sobrevive al polling.
function renderList(data) {
  if (pendingRemoval !== null && !data.checkins.some((c) => c.id === pendingRemoval)) {
    pendingRemoval = null; // ya no existe (p. ej. se quitó en otra pestaña)
  }
  const key = JSON.stringify([data.checkins, pendingRemoval]);
  if (key === renderedListKey) return;
  renderedListKey = key;

  $("s-total").textContent =
    data.total === 1 ? "1 alumno registrado" : `${data.total} alumnos registrados`;
  $("s-list").replaceChildren(...data.checkins.map(checkinRow));

  // Foco en la opción segura, como al cerrar la asistencia: dos Enter seguidos no borran a nadie.
  document.querySelector("#s-list [data-action='cancel']")?.focus();
}

function button(text, className, action, id) {
  const b = document.createElement("button");
  b.type = "button";
  b.className = className;
  b.textContent = text;
  b.dataset.action = action;
  b.dataset.id = id;
  return b;
}

function checkinRow(c) {
  const li = document.createElement("li");
  if (c.id === pendingRemoval) {
    li.className = "confirm-row";
    const question = document.createElement("span");
    question.className = "name";
    question.textContent = `¿Quitar a ${c.name}?`; // CA-12: texto literal
    const actions = document.createElement("span");
    actions.className = "row-actions";
    actions.append(
      button("Sí, quitar", "danger-solid small", "confirm", c.id),
      button("Cancelar", "secondary small", "cancel", c.id),
    );
    li.append(question, actions);
    return li;
  }
  const name = document.createElement("span");
  name.className = "name";
  name.textContent = c.name; // CA-12: siempre texto literal
  const actions = document.createElement("span");
  actions.className = "row-actions";
  const time = document.createElement("span");
  time.className = "meta";
  time.textContent = hhmm(c.checkedAt);
  const remove = button("Quitar", "danger small", "remove", c.id);
  remove.setAttribute("aria-label", `Quitar a ${c.name}`);
  actions.append(time, remove);
  li.append(name, actions);
  return li;
}

$("s-list").addEventListener("click", async (event) => {
  const target = event.target.closest("button[data-action]");
  if (!target || !currentSession) return;
  const id = Number(target.dataset.id);
  const action = target.dataset.action;

  if (action === "remove") {
    pendingRemoval = id;
  } else if (action === "cancel") {
    pendingRemoval = null;
  } else if (action === "confirm") {
    target.disabled = true;
    try {
      const res = await api(
        `/api/sessions/${encodeURIComponent(currentSession.id)}/checkins/${id}`,
        { method: "DELETE" },
      );
      if (!res.ok && res.status !== 404) throw new Error("remove");
      pendingRemoval = null;
      await poll(); // trae la lista y el total actualizados
      return;
    } catch (error) {
      return handleError(error);
    }
  }
  renderList(currentSession);
  if (action === "cancel") {
    document.querySelector(`#s-list [data-action='remove'][data-id='${id}']`)?.focus();
  }
});

function startCountdown(seconds) {
  clearInterval(countdownTimer);
  let left = seconds;
  const paint = () => {
    $("s-countdown").textContent = `Cambia en ${left} s`;
  };
  paint();
  countdownTimer = setInterval(() => {
    left -= 1;
    if (left <= 0) {
      clearInterval(countdownTimer);
      $("s-countdown").textContent = "Cambiando…";
      poll(); // pide el código nuevo en cuanto caduca el actual
      return;
    }
    paint();
  }, 1000);
}

async function poll() {
  clearTimeout(pollTimer);
  const sessionId = hashParams().get("s");
  if (!sessionId) return;
  try {
    const res = await api(`/api/sessions/${encodeURIComponent(sessionId)}`);
    if (res.status === 404) {
      stopTimers();
      showView(null);
      showMessage("error", "Esa sesión no existe.");
      return;
    }
    const data = await res.json();
    if (hashParams().get("s") !== sessionId) return; // el usuario ya cambió de vista
    showMessage("", "");
    renderSession(data);
    if (data.open) pollTimer = setTimeout(poll, POLL_MS);
  } catch (error) {
    if (error instanceof AuthError) return handleError(error);
    // Fallo puntual de red: avisar y seguir intentándolo.
    showMessage("error", "Sin conexión con la app. Reintentando…");
    pollTimer = setTimeout(poll, POLL_MS);
  }
}

$("copy").addEventListener("click", async () => {
  const link = $("s-link").textContent;
  try {
    await navigator.clipboard.writeText(link);
    $("copy").textContent = "¡Copiado!";
  } catch {
    // Sin permiso de portapapeles: seleccionar el texto para copiarlo a mano.
    getSelection().selectAllChildren($("s-link"));
    $("copy").textContent = "Selecciónalo y cópialo";
  }
  setTimeout(() => ($("copy").textContent = "Copiar enlace de alumnos"), 2000);
});

$("download").addEventListener("click", () => {
  if (currentSession) downloadCsv(currentSession.id).catch(handleError);
});

// Cerrar con confirmación dentro de la página (CA-13)
$("close").addEventListener("click", () => {
  $("confirm-close").hidden = false;
  $("confirm-no").focus();
});
$("confirm-no").addEventListener("click", () => {
  $("confirm-close").hidden = true;
  $("close").focus();
});
$("confirm-yes").addEventListener("click", async () => {
  $("confirm-close").hidden = true;
  try {
    await api(`/api/sessions/${encodeURIComponent(currentSession.id)}/close`, { method: "POST" });
    stopTimers();
    await poll();
  } catch (error) {
    handleError(error);
  }
});

// ---------- arranque y navegación ----------

async function route() {
  stopTimers();
  pendingRemoval = null;
  renderedListKey = "";
  showMessage("", "");
  $("confirm-close").hidden = true;
  $("back").href = hrefFor();

  if (!token()) {
    showView(null);
    showMessage("error", "Falta el enlace secreto. Abre el enlace del panel que aparece en la terminal al arrancar la app.");
    return;
  }
  try {
    if (hashParams().get("s")) {
      showView("session");
      await poll();
    } else {
      currentSession = null;
      await renderPanel();
    }
  } catch (error) {
    handleError(error);
  }
}

// CA-21: aviso si el panel se abre en una dirección local
$("local-warning").hidden = !["localhost", "127.0.0.1", "[::1]"].includes(location.hostname);

window.addEventListener("hashchange", route);
route();
