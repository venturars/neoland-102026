// AsistenciApp teacher panel, session management and live classroom view.

const POLL_MS = 2000;
const CODE_LIFETIME_SECONDS = 30;
const AVATAR_COLOR_COUNT = 6;

const $ = (id) => document.getElementById(id);
const statusElement = $("status");
const views = { panel: $("panel-view"), session: $("session-view") };

let pollTimer = null;
let countdownTimer = null;
let arrivalTimer = null;
let currentSession = null;
let renderedListKey = "";
let seenCheckinIds = null;
let liveModeOpen = false;
let focusBeforeLiveMode = null;

class AuthError extends Error {}

function hashParams() {
  return new URLSearchParams(location.hash.slice(1));
}

function teacherToken() {
  return hashParams().get("t") || "";
}

function hrefFor(sessionId) {
  const params = new URLSearchParams({ t: teacherToken() });
  if (sessionId) params.set("s", sessionId);
  return `#${params}`;
}

async function api(path, options = {}) {
  const response = await fetch(path, {
    ...options,
    headers: {
      "X-Teacher-Token": teacherToken(),
      "Content-Type": "application/json",
      ...options.headers,
    },
  });
  if (response.status === 401) throw new AuthError();
  return response;
}

function showMessage(kind, text) {
  statusElement.replaceChildren();
  if (!text) return;
  const message = document.createElement("p");
  message.className = `message ${kind}`;
  message.textContent = text;
  statusElement.append(message);
}

function showView(name) {
  for (const [viewName, element] of Object.entries(views)) {
    element.hidden = viewName !== name;
  }
}

function timeOnly(isoDate) {
  return new Date(isoDate).toLocaleTimeString("es-ES", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

function dateAndTime(isoDate) {
  return new Date(isoDate).toLocaleString("es-ES", {
    dateStyle: "short",
    timeStyle: "short",
  });
}

function stopTimers() {
  clearTimeout(pollTimer);
  clearInterval(countdownTimer);
  clearTimeout(arrivalTimer);
  pollTimer = countdownTimer = arrivalTimer = null;
}

function handleError(error) {
  stopTimers();
  if (error instanceof AuthError) {
    showView(null);
    showMessage(
      "error",
      "Enlace del panel no válido. Abre el enlace exacto que aparece en la terminal al arrancar la app.",
    );
    return;
  }
  showMessage("error", "No se pudo conectar con la app. ¿Sigue arrancada en tu ordenador?");
}

function renderDashboardStats(sessions) {
  let totalCheckins = 0;
  const openSessions = [];

  for (const session of sessions) {
    totalCheckins += session.total;
    if (!session.closedAt) openSessions.push(session);
  }

  const average = sessions.length === 0 ? 0 : Math.round(totalCheckins / sessions.length);

  $("stat-sessions").textContent = sessions.length;
  $("stat-average").textContent = average;
  $("stat-open").textContent = openSessions.length;

  const liveNavigation = $("nav-live");
  liveNavigation.disabled = openSessions.length === 0;
  liveNavigation.dataset.sessionId = openSessions[0]?.id || "";
}

function createSessionRow(session) {
  const row = document.createElement("li");
  row.className = "session-row";

  const icon = document.createElement("span");
  icon.className = "session-row-icon";
  icon.textContent = session.closedAt ? "✓" : "▶";

  const info = document.createElement("div");
  info.className = "info";
  const titleLine = document.createElement("div");
  const title = document.createElement("strong");
  title.textContent = session.title;
  const badge = document.createElement("span");
  badge.className = session.closedAt ? "badge closed" : "badge";
  badge.textContent = session.closedAt ? "cerrada" : "abierta";
  titleLine.append(title, badge);

  const meta = document.createElement("div");
  meta.className = "muted small";
  const attendeeWord = session.total === 1 ? "asistente" : "asistentes";
  meta.textContent = `${dateAndTime(session.openedAt)} · ${session.total} ${attendeeWord}`;
  info.append(titleLine, meta);

  const actions = document.createElement("div");
  actions.className = "buttons";
  const open = document.createElement("a");
  open.className = "button secondary small";
  open.href = hrefFor(session.id);
  open.textContent = "Ver";
  const download = document.createElement("button");
  download.type = "button";
  download.className = "secondary small";
  download.textContent = "Descargar";
  download.addEventListener("click", () => downloadCsv(session.id).catch(handleError));
  actions.append(open, download);

  row.append(icon, info, actions);
  return row;
}

async function renderPanel() {
  showView("panel");
  document.title = "Panel del profesor · AsistenciApp";
  $("brand-home").href = hrefFor();

  const response = await api("/api/sessions");
  const sessions = await response.json();
  renderDashboardStats(sessions);

  const list = $("sessions");
  list.replaceChildren();
  for (const session of sessions) {
    list.append(createSessionRow(session));
  }
  $("no-sessions").hidden = sessions.length > 0;
  list.hidden = sessions.length === 0;
}

$("new-session").addEventListener("submit", async (event) => {
  event.preventDefault();
  const submitButton = event.submitter;
  submitButton.disabled = true;
  try {
    const response = await api("/api/sessions", {
      method: "POST",
      body: JSON.stringify({ title: $("session-title").value }),
    });
    const session = await response.json();
    $("session-title").value = "";
    location.hash = hrefFor(session.id);
  } catch (error) {
    handleError(error);
  } finally {
    submitButton.disabled = false;
  }
});

for (const link of document.querySelectorAll("[data-scroll-to]")) {
  link.addEventListener("click", (event) => {
    // Prevent the section anchor from replacing the secret token stored in the hash.
    event.preventDefault();
    const section = $(link.dataset.scrollTo);
    section.scrollIntoView({ behavior: "smooth", block: "start" });
    section.focus({ preventScroll: true });
  });
}

$("nav-live").addEventListener("click", () => {
  const sessionId = $("nav-live").dataset.sessionId;
  if (sessionId) location.hash = hrefFor(sessionId);
});

async function downloadCsv(sessionId) {
  const response = await api(`/api/sessions/${encodeURIComponent(sessionId)}/export`);
  if (!response.ok) throw new Error("export");
  const blob = await response.blob();
  const disposition = response.headers.get("Content-Disposition") || "";
  const filename = /filename="([^"]+)"/.exec(disposition)?.[1] || "asistencia.csv";
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.append(link);
  link.click();
  link.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

function initialsFor(name) {
  const words = name.trim().split(/\s+/).filter(Boolean);
  if (words.length === 0) return "?";

  const firstInitial = words[0][0];
  if (words.length === 1) return firstInitial.toLocaleUpperCase("es-ES");

  const lastInitial = words.at(-1)[0];
  return `${firstInitial}${lastInitial}`.toLocaleUpperCase("es-ES");
}

function avatarColorFor(name) {
  let total = 0;
  for (const character of name) {
    total += character.codePointAt(0);
  }
  return (total % AVATAR_COLOR_COUNT) + 1;
}

function createLiveStudent(checkin, isNew) {
  const card = document.createElement("article");
  card.className = "live-student";
  if (isNew) card.classList.add("new-arrival");

  const avatar = document.createElement("span");
  avatar.className = `student-avatar avatar-color-${avatarColorFor(checkin.name)}`;
  avatar.textContent = initialsFor(checkin.name);
  avatar.setAttribute("aria-hidden", "true");

  const name = document.createElement("span");
  name.className = "live-student-name";
  name.textContent = checkin.name;

  card.append(avatar, name);
  return card;
}

function findNewCheckins(checkins) {
  if (seenCheckinIds === null) {
    // Keep the first load silent so existing students are not announced as new arrivals.
    seenCheckinIds = new Set(checkins.map((checkin) => checkin.id));
    return [];
  }

  const newCheckins = checkins.filter((checkin) => !seenCheckinIds.has(checkin.id));
  for (const checkin of newCheckins) seenCheckinIds.add(checkin.id);
  return newCheckins;
}

function showArrivalToast(newCheckins) {
  if (newCheckins.length === 0) return;
  clearTimeout(arrivalTimer);

  const toast = $("arrival-toast");
  const lastArrival = newCheckins.at(-1);
  if (newCheckins.length === 1) {
    toast.textContent = `✓ ${lastArrival.name} acaba de entrar`;
  } else {
    toast.textContent = `✓ ${newCheckins.length} alumnos acaban de entrar`;
  }
  toast.hidden = false;
  toast.classList.add("visible");

  arrivalTimer = setTimeout(() => {
    toast.classList.remove("visible");
    toast.hidden = true;
  }, 3200);
}

function renderLiveStudents(checkins, newCheckins) {
  const newIds = new Set(newCheckins.map((checkin) => checkin.id));
  const studentList = $("live-students");
  studentList.replaceChildren();
  for (const checkin of checkins) {
    studentList.append(createLiveStudent(checkin, newIds.has(checkin.id)));
  }
  $("live-total").textContent = checkins.length;
}

function createCheckinRow(checkin, isNew) {
  const row = document.createElement("li");
  row.className = "attendance-student-card";
  if (isNew) row.classList.add("new-arrival");

  const identity = document.createElement("span");
  identity.className = "checkin-identity";
  const avatar = document.createElement("span");
  avatar.className = `classroom-avatar avatar-color-${avatarColorFor(checkin.name)}`;
  avatar.textContent = initialsFor(checkin.name);
  avatar.setAttribute("aria-hidden", "true");
  const name = document.createElement("span");
  name.className = "name";
  name.textContent = checkin.name;
  const time = document.createElement("time");
  time.className = "attendance-student-time";
  time.dateTime = checkin.checkedAt;
  time.textContent = `Llegó a las ${timeOnly(checkin.checkedAt)}`;
  identity.append(avatar, name, time);
  row.append(identity);
  return row;
}

function renderAttendanceList(data, newCheckins) {
  const key = JSON.stringify(data.checkins);
  if (key === renderedListKey) return;
  renderedListKey = key;

  const totalText = data.total === 1 ? "1 alumno" : `${data.total} alumnos`;
  $("s-total").textContent = totalText;
  $("empty-checkins").hidden = data.total > 0;
  const newIds = new Set(newCheckins.map((checkin) => checkin.id));
  const attendanceList = $("s-list");
  attendanceList.replaceChildren();
  for (const checkin of data.checkins) {
    attendanceList.append(createCheckinRow(checkin, newIds.has(checkin.id)));
  }
}

function paintCountdown(secondsLeft) {
  const text = secondsLeft > 0 ? `Cambia en ${secondsLeft} s` : "Cambiando…";
  $("s-countdown").textContent = text;
  $("live-countdown").textContent = text;

  const progress = Math.max(0, secondsLeft) / CODE_LIFETIME_SECONDS;
  for (const ring of document.querySelectorAll(".code-ring")) {
    ring.style.setProperty("--countdown-progress", `${progress * 360}deg`);
    ring.classList.toggle("is-ending", secondsLeft > 0 && secondsLeft <= 5);
  }
}

function startCountdown(seconds) {
  clearInterval(countdownTimer);
  let secondsLeft = seconds;
  paintCountdown(secondsLeft);
  countdownTimer = setInterval(() => {
    secondsLeft -= 1;
    paintCountdown(secondsLeft);
    if (secondsLeft <= 0) {
      clearInterval(countdownTimer);
      poll();
    }
  }, 1000);
}

function renderSession(data) {
  currentSession = data;
  document.title = `${data.title} · AsistenciApp`;
  $("s-title").textContent = data.title;
  $("live-title").textContent = data.title;
  $("s-link").textContent = data.studentUrl;

  $("code-card").hidden = !data.open;
  $("s-closed").hidden = data.open;
  $("close").hidden = !data.open;
  $("enter-live").hidden = !data.open;

  if (data.open) {
    $("s-code").textContent = data.code;
    $("live-code").textContent = data.code;
    startCountdown(data.secondsLeft);
  } else if (liveModeOpen) {
    closeLiveView();
  }

  const newCheckins = findNewCheckins(data.checkins);
  renderAttendanceList(data, newCheckins);
  renderLiveStudents(data.checkins, newCheckins);
  showArrivalToast(newCheckins);
}

async function poll() {
  clearTimeout(pollTimer);
  const sessionId = hashParams().get("s");
  if (!sessionId) return;

  try {
    const response = await api(`/api/sessions/${encodeURIComponent(sessionId)}`);
    if (response.status === 404) {
      stopTimers();
      showView(null);
      showMessage("error", "Esa sesión no existe.");
      return;
    }

    const data = await response.json();
    if (hashParams().get("s") !== sessionId) return;
    showMessage("", "");
    renderSession(data);
    if (data.open) pollTimer = setTimeout(poll, POLL_MS);
  } catch (error) {
    if (error instanceof AuthError) {
      handleError(error);
      return;
    }
    showMessage("error", "Sin conexión con la app. Reintentando…");
    pollTimer = setTimeout(poll, POLL_MS);
  }
}

function closeLiveView() {
  if (!liveModeOpen) return;
  liveModeOpen = false;
  $("live-classroom").hidden = true;
  document.body.classList.remove("live-mode-open");
  if (focusBeforeLiveMode instanceof HTMLElement) focusBeforeLiveMode.focus();
}

async function enterLiveClassroom() {
  if (!currentSession?.open) return;
  focusBeforeLiveMode = document.activeElement;
  liveModeOpen = true;
  $("live-classroom").hidden = false;
  document.body.classList.add("live-mode-open");
  $("exit-live").focus();

  if ($("live-classroom").requestFullscreen) {
    try {
      await $("live-classroom").requestFullscreen();
    } catch {
      // Fullscreen is optional; the fixed live view remains available in the page.
    }
  }
}

async function exitLiveClassroom() {
  if (document.fullscreenElement) {
    try {
      await document.exitFullscreen();
    } catch {
      closeLiveView();
    }
    return;
  }
  closeLiveView();
}

$("enter-live").addEventListener("click", enterLiveClassroom);
$("exit-live").addEventListener("click", exitLiveClassroom);

document.addEventListener("fullscreenchange", () => {
  if (liveModeOpen && !document.fullscreenElement) closeLiveView();
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && liveModeOpen && !document.fullscreenElement) closeLiveView();
});

$("copy").addEventListener("click", async () => {
  const link = $("s-link").textContent;
  try {
    await navigator.clipboard.writeText(link);
    $("copy").textContent = "¡Copiado!";
  } catch {
    getSelection().selectAllChildren($("s-link"));
    $("copy").textContent = "Selecciónalo y cópialo";
  }
  setTimeout(() => {
    $("copy").textContent = "Copiar enlace de alumnos";
  }, 2000);
});

$("download").addEventListener("click", () => {
  if (currentSession) downloadCsv(currentSession.id).catch(handleError);
});

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
    await api(`/api/sessions/${encodeURIComponent(currentSession.id)}/close`, {
      method: "POST",
    });
    stopTimers();
    await poll();
  } catch (error) {
    handleError(error);
  }
});

async function route() {
  stopTimers();
  closeLiveView();
  renderedListKey = "";
  seenCheckinIds = null;
  showMessage("", "");
  $("confirm-close").hidden = true;
  $("back").href = hrefFor();
  $("back-label").href = hrefFor();

  if (!teacherToken()) {
    showView(null);
    showMessage(
      "error",
      "Falta el enlace secreto. Abre el enlace del panel que aparece en la terminal al arrancar la app.",
    );
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

$("local-warning").hidden = !["localhost", "127.0.0.1", "[::1]"].includes(location.hostname);
window.addEventListener("hashchange", route);
route();
