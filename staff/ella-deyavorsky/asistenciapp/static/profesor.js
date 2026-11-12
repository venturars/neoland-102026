// AsistenciApp · panel del profesor (T17 panel · T18 vista de sesión)
// El token va en el fragmento (#t=…): el navegador nunca lo envía en la URL (plan §2.2).
// La navegación también usa el fragmento: #t=<token> (panel), #t=<token>&s=<id> (sesión)
// y #t=<token>&g=<id|new> (grupo, spec 007).
// Todo texto que viene del servidor se pinta con textContent (CA-12).

const POLL_MS = 2000; // CA-10: la lista se actualiza en ≤ 5 s

const $ = (id) => document.getElementById(id);
const statusEl = $("status");
const views = { panel: $("panel-view"), session: $("session-view"), group: $("group-view") };

let pollTimer = null;
let countdownTimer = null;
let currentSession = null;
let pendingRemoval = null; // id del registro que espera confirmación (CA-24)
let renderedListKey = ""; // para no repintar la lista si no ha cambiado
let showArchived = false; // spec 007: lista de grupos archivados desplegada
let pendingGroupAction = null; // {id, action} del grupo que espera confirmación
let currentGroup = null; // grupo abierto en la vista «Grupo», o null si es nuevo
let similarAccepted = false; // «Subir igualmente»: los parecidos ya se han visto (CA-24)
let pendingStudent = null; // {id, action} del alumno que espera confirmación o renombre

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

function hrefForGroup(groupId) {
  return `#${new URLSearchParams({ t: token(), g: groupId })}`;
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

async function renderPanel() {
  showView("panel");
  document.title = "Panel del profesor · AsistenciApp";
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
    meta.textContent = `${dateTime(s.openedAt)} · ${s.total} ${s.total === 1 ? "asistente" : "asistentes"}`
      + (s.group ? ` · ${s.group}` : "");
    info.append(title, badge, meta);

    const buttons = document.createElement("div");
    buttons.className = "buttons";
    const open = document.createElement("a");
    open.className = "button secondary small";
    open.href = hrefFor(s.id);
    open.textContent = "Ver";
    const download = document.createElement("button");
    download.type = "button";
    download.className = "secondary small";
    download.textContent = "Descargar lista";
    download.addEventListener("click", () => downloadCsv(s.id).catch(handleError));
    buttons.append(open, download);

    li.append(info, buttons);
    list.append(li);
  }
  await renderGroups();
}

// ---------- grupos en el panel (spec 007, RF-4 a RF-6) ----------

async function renderGroups() {
  const active = await (await api("/api/groups")).json();
  const select = $("session-group");
  const chosen = select.value;
  select.replaceChildren(select.options[0]);
  for (const g of active) {
    const option = document.createElement("option");
    option.value = g.id;
    option.textContent = `${g.name} (${g.students} ${g.students === 1 ? "alumno" : "alumnos"})`;
    select.append(option);
  }
  select.value = active.some((g) => g.id === chosen) ? chosen : "";

  $("no-groups").hidden = active.length > 0;
  $("groups").hidden = active.length === 0;
  $("groups").replaceChildren(...active.map(groupRow));

  $("toggle-archived").textContent = showArchived ? "Ocultar archivados" : "Ver archivados";
  $("archived-groups").hidden = !showArchived;
  if (showArchived) {
    const archived = await (await api("/api/groups?archived=1")).json();
    $("archived-groups").replaceChildren(...archived.map(groupRow));
    if (archived.length === 0) {
      const li = document.createElement("li");
      li.className = "muted";
      li.textContent = "No hay grupos archivados.";
      $("archived-groups").append(li);
    }
  }
}

function groupRow(g) {
  const li = document.createElement("li");
  if (pendingGroupAction?.id === g.id) {
    li.className = "confirm-row";
    const question = document.createElement("span");
    question.className = "name";
    question.textContent = `¿Borrar el grupo ${g.name}? Sus listas de asistencia pasadas se conservan.`;
    const actions = document.createElement("span");
    actions.className = "row-actions";
    actions.append(
      button("Sí, borrar", "danger-solid small", "group-delete-yes", g.id),
      button("Cancelar", "secondary small", "group-cancel", g.id),
    );
    li.append(question, actions);
    return li;
  }
  const info = document.createElement("div");
  info.className = "info";
  const name = document.createElement("strong");
  name.textContent = g.name;
  const meta = document.createElement("div");
  meta.className = "muted small";
  meta.textContent = `${g.students} ${g.students === 1 ? "alumno" : "alumnos"}`;
  info.append(name, meta);
  const buttons = document.createElement("div");
  buttons.className = "buttons";
  const edit = document.createElement("a");
  edit.className = "button secondary small";
  edit.href = hrefForGroup(g.id);
  edit.textContent = "Editar";
  buttons.append(
    edit,
    g.archived
      ? button("Restaurar", "secondary small", "group-restore", g.id)
      : button("Archivar", "secondary small", "group-archive", g.id),
    button("Borrar", "danger small", "group-delete", g.id),
  );
  li.append(info, buttons);
  return li;
}

async function onGroupListClick(event) {
  const target = event.target.closest("button[data-action]");
  if (!target) return;
  const id = target.dataset.id;
  const action = target.dataset.action;
  showMessage("", "");
  try {
    if (action === "group-delete") {
      pendingGroupAction = { id, action };
    } else if (action === "group-cancel") {
      pendingGroupAction = null;
    } else if (action === "group-delete-yes") {
      pendingGroupAction = null;
      const res = await api(`/api/groups/${encodeURIComponent(id)}`, { method: "DELETE" });
      if (!res.ok) showMessage("error", (await res.json()).error); // RF-6: sesión abierta
    } else {
      await api(`/api/groups/${encodeURIComponent(id)}`, {
        method: "PATCH",
        body: JSON.stringify({ archived: action === "group-archive" }),
      }); // RF-5
    }
    await renderGroups();
  } catch (error) {
    handleError(error);
  }
}

$("groups").addEventListener("click", onGroupListClick);
$("archived-groups").addEventListener("click", onGroupListClick);
$("toggle-archived").addEventListener("click", () => {
  showArchived = !showArchived;
  renderGroups().catch(handleError);
});

async function openSession(groupId, submitter) {
  if (submitter) submitter.disabled = true;
  $("open-error").hidden = true;
  try {
    const res = await api("/api/sessions", {
      method: "POST",
      body: JSON.stringify({ title: $("session-title").value, groupId: groupId || null }),
    }); // CA-01, CA-02; spec 007, RF-8
    const data = await res.json();
    if (!res.ok) {
      // spec 007, CA-19: grupo vacío (o archivado): se ofrece añadir alumnos o una sesión rápida
      $("open-error-text").textContent = data.error;
      $("open-error-edit").href = hrefForGroup(groupId);
      $("open-error").hidden = false;
      $("open-quick").focus();
      return;
    }
    $("session-title").value = "";
    location.hash = hrefFor(data.id);
  } catch (error) {
    handleError(error);
  } finally {
    if (submitter) submitter.disabled = false;
  }
}

$("new-session").addEventListener("submit", (event) => {
  event.preventDefault();
  openSession($("session-group").value, event.submitter);
});
$("open-quick").addEventListener("click", () => openSession("", $("open-quick")));
$("session-group").addEventListener("change", () => ($("open-error").hidden = true));

// ---------- vista «Grupo» (spec 007, RF-1 a RF-3) ----------

async function renderGroupView(groupId) {
  showView("group");
  pendingStudent = null;
  setBoxes([]);
  $("g-file").value = "";
  resetReview();
  if (groupId === "new") {
    currentGroup = null;
    document.title = "Nuevo grupo · AsistenciApp";
    $("g-title").textContent = "Nuevo grupo";
    $("g-name").value = "";
    $("g-rename").hidden = true;
    $("g-students-card").hidden = true;
    $("g-add-title").textContent = "Alumnos";
    $("g-name").focus();
    return;
  }
  const res = await api(`/api/groups/${encodeURIComponent(groupId)}`);
  if (res.status === 404) {
    showView(null);
    showMessage("error", "Ese grupo no existe.");
    return;
  }
  currentGroup = await res.json();
  document.title = `${currentGroup.name} · AsistenciApp`;
  $("g-title").textContent = currentGroup.archived ? `${currentGroup.name} (archivado)` : currentGroup.name;
  $("g-name").value = currentGroup.name;
  $("g-rename").hidden = false;
  $("g-add-title").textContent = "Añadir alumnos";
  renderGroupStudents();
}

function renderGroupStudents() {
  const students = currentGroup.students;
  $("g-students-card").hidden = false;
  $("g-count").textContent = students.length === 1 ? "1 alumno" : `${students.length} alumnos`;
  $("g-students").replaceChildren(...students.map(studentRow));
}

function studentRow(s) {
  const li = document.createElement("li");
  if (pendingStudent?.id === s.id && pendingStudent.action === "rename") {
    const input = document.createElement("input");
    input.value = s.name;
    input.maxLength = 60;
    input.setAttribute("aria-label", `Nuevo nombre para ${s.name}`);
    input.style.marginBottom = "0";
    input.dataset.renameFor = s.id;
    const actions = document.createElement("span");
    actions.className = "row-actions";
    actions.append(
      button("Guardar", "small", "student-rename-yes", s.id),
      button("Cancelar", "secondary small", "student-cancel", s.id),
    );
    li.append(input, actions);
    return li;
  }
  if (pendingStudent?.id === s.id && pendingStudent.action === "remove") {
    li.className = "confirm-row";
    const question = document.createElement("span");
    question.className = "name";
    question.textContent = `¿Quitar a ${s.name} del grupo?`;
    const actions = document.createElement("span");
    actions.className = "row-actions";
    actions.append(
      button("Sí, quitar", "danger-solid small", "student-remove-yes", s.id),
      button("Cancelar", "secondary small", "student-cancel", s.id),
    );
    li.append(question, actions);
    return li;
  }
  const name = document.createElement("span");
  name.className = "name";
  name.textContent = s.name;
  const actions = document.createElement("span");
  actions.className = "row-actions";
  const rename = button("Renombrar", "secondary small", "student-rename", s.id);
  rename.setAttribute("aria-label", `Renombrar a ${s.name}`);
  const remove = button("Quitar", "danger small", "student-remove", s.id);
  remove.setAttribute("aria-label", `Quitar a ${s.name}`);
  actions.append(rename, remove);
  li.append(name, actions);
  return li;
}

async function reloadGroup(message) {
  await renderGroupView(currentGroup.id);
  if (message) showMessage("warn", message);
}

$("g-students").addEventListener("click", async (event) => {
  const target = event.target.closest("button[data-action]");
  if (!target || !currentGroup) return;
  const id = Number(target.dataset.id);
  const action = target.dataset.action;
  const base = `/api/groups/${encodeURIComponent(currentGroup.id)}/students/${id}`;
  showMessage("", "");
  try {
    if (action === "student-rename" || action === "student-remove") {
      pendingStudent = { id, action: action.replace("student-", "") };
    } else if (action === "student-cancel") {
      pendingStudent = null;
    } else if (action === "student-rename-yes") {
      const name = document.querySelector(`[data-rename-for='${id}']`).value;
      const res = await api(base, { method: "PATCH", body: JSON.stringify({ name }) });
      const data = await res.json();
      if (!res.ok) return showMessage("error", data.error); // RF-7: nombre repetido
      pendingStudent = null;
      return reloadGroup(data.similar ? `Aviso: se parece a ${data.similar}. ¿Es otra persona?` : "");
    } else if (action === "student-remove-yes") {
      await api(base, { method: "DELETE" });
      pendingStudent = null;
      return reloadGroup();
    }
    renderGroupStudents();
    document.querySelector("#g-students input, #g-students [data-action$='-yes']")?.focus();
  } catch (error) {
    handleError(error);
  }
});

$("g-rename").addEventListener("click", async () => {
  try {
    const res = await api(`/api/groups/${encodeURIComponent(currentGroup.id)}`, {
      method: "PATCH",
      body: JSON.stringify({ name: $("g-name").value }),
    }); // RF-3
    if (!res.ok) return showMessage("error", (await res.json()).error);
    await reloadGroup();
    showMessage("ok", "Nombre del grupo guardado.");
  } catch (error) {
    handleError(error);
  }
});

function readFile(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = () => reject(reader.error);
    reader.readAsText(file, "utf-8");
  });
}

function problemList(title, items) {
  const wrap = document.createElement("div");
  const p = document.createElement("p");
  p.textContent = title;
  const ul = document.createElement("ul");
  ul.className = "problems";
  for (const item of items) {
    const li = document.createElement("li");
    li.textContent = item;
    ul.append(li);
  }
  wrap.append(p, ul);
  return wrap;
}

// RF-2: vista previa con el número de alumnos y los problemas, antes de guardar.
function renderPreview(data) {
  const box = $("g-preview");
  box.replaceChildren();
  const count = document.createElement("p");
  count.className = "total";
  count.textContent = data.students.length === 1 ? "1 alumno detectado" : `${data.students.length} alumnos detectados`;
  box.append(count);
  if (data.empty) {
    const p = document.createElement("p");
    p.className = "muted small";
    p.textContent = `${data.empty} ${data.empty === 1 ? "línea vacía ignorada" : "líneas vacías ignoradas"}.`;
    box.append(p);
  }
  const problems = document.createElement("div");
  problems.className = "message error";
  if (data.duplicates.length) {
    problems.append(problemList("Repetidos (diferéncialos, por ejemplo con la inicial del apellido):", data.duplicates));
  }
  if (data.tooLong.length) problems.append(problemList("Nombres de más de 60 caracteres:", data.tooLong));
  if (data.tooMany) problems.append(problemList("Un grupo no puede tener más de 200 alumnos.", []));
  if (problems.childElementCount) box.append(problems);
  if (data.similar.length) {
    const warn = document.createElement("div");
    warn.className = "message warn";
    warn.append(problemList("¿Quisiste decir…? Revisa estos nombres parecidos:",
      data.similar.map((s) => `${s.name} → ${s.like}`)));
    box.append(warn);
  }
}

// ---------- casillas de alumnos (spec 007 v1.3, RF-1, RF-2) ----------

function boxInputs() {
  return [...$("g-boxes").querySelectorAll("input")];
}

function boxRow(value = "") {
  const li = document.createElement("li");
  const input = document.createElement("input");
  input.value = value;
  input.maxLength = 60;
  input.autocomplete = "off";
  const remove = document.createElement("button");
  remove.type = "button";
  remove.className = "secondary small";
  remove.dataset.action = "box-remove";
  remove.textContent = "×";
  const note = document.createElement("span");
  note.className = "box-note";
  note.hidden = true;
  li.append(input, remove, note);
  return li;
}

// Las etiquetas llevan el número de casilla: se rehacen cada vez que se añade o se quita una.
function renumberBoxes() {
  $("g-boxes").querySelectorAll("li").forEach((li, i) => {
    const input = li.querySelector("input");
    const note = li.querySelector(".box-note");
    note.id = `g-box-note-${i + 1}`;
    input.setAttribute("aria-label", `Alumno ${i + 1}`);
    input.setAttribute("aria-describedby", note.id);
    li.querySelector("button").setAttribute("aria-label", `Quitar la casilla ${i + 1}`);
  });
}

function setBoxes(names) {
  $("g-boxes").replaceChildren(...(names.length ? names : [""]).map((name) => boxRow(name)));
  renumberBoxes();
}

// Inserta casillas detrás de `li` y devuelve la última, para ponerle el foco.
function addBoxesAfter(li, names) {
  const rows = names.map((name) => boxRow(name));
  li.after(...rows);
  renumberBoxes();
  return rows[rows.length - 1].querySelector("input");
}

function boxNames() {
  return boxInputs().map((input) => input.value.trim()).filter(Boolean);
}

function setBoxProblem(input, text) {
  const note = input.parentElement.querySelector(".box-note");
  note.textContent = text;
  note.hidden = !text;
  if (text) input.setAttribute("aria-invalid", "true");
  else input.removeAttribute("aria-invalid");
}

// RF-2: cada problema se marca en su casilla. De dos nombres repetidos, el servidor
// señala el de más abajo, así que se busca empezando por la última casilla.
function markBoxes(data) {
  const pending = [
    ...data.duplicates.map((name) => [name.trim(), "Repetido"]),
    ...data.tooLong.map((name) => [name.trim(), "Demasiado largo"]),
  ];
  for (const input of boxInputs().reverse()) {
    const i = pending.findIndex(([name]) => name === input.value.trim());
    if (i === -1) continue;
    setBoxProblem(input, pending[i][1]);
    pending.splice(i, 1);
  }
}

// Cambiar una casilla deja viejo lo revisado: se quitan las marcas y se vuelve a «Subir lista».
function resetReview() {
  similarAccepted = false;
  $("g-save").textContent = "Subir lista";
  $("g-preview").replaceChildren();
  for (const input of boxInputs()) setBoxProblem(input, "");
}

async function reviewBoxes() {
  const res = await api("/api/groups/preview", {
    method: "POST",
    body: JSON.stringify({ text: boxNames().join("\n"), source: "paste", groupId: currentGroup?.id }),
  });
  const data = await res.json();
  renderPreview(data);
  markBoxes(data);
  return data;
}

// CA-23: Intro pasa a la casilla siguiente o crea una nueva; nunca sube la lista.
$("g-boxes").addEventListener("keydown", (event) => {
  if (event.key !== "Enter" || event.isComposing || !event.target.matches("input")) return;
  event.preventDefault();
  const li = event.target.closest("li");
  (li.nextElementSibling?.querySelector("input") || addBoxesAfter(li, [""])).focus();
});

// RF-1a: pegar varias líneas en una casilla reparte los nombres, uno por casilla.
$("g-boxes").addEventListener("paste", (event) => {
  const text = event.clipboardData?.getData("text") || "";
  if (!event.target.matches("input") || !/[\r\n]/.test(text)) return;
  event.preventDefault();
  const lines = text.split(/\r?\n/).map((line) => line.trim()).filter(Boolean);
  const input = event.target;
  if (lines.length && !input.value.trim()) input.value = lines.shift();
  (lines.length ? addBoxesAfter(input.closest("li"), lines) : input).focus();
  resetReview();
});

$("g-boxes").addEventListener("click", (event) => {
  if (!event.target.closest("[data-action='box-remove']")) return;
  const li = event.target.closest("li");
  const neighbour = li.previousElementSibling || li.nextElementSibling;
  if (neighbour) {
    li.remove();
    renumberBoxes();
    neighbour.querySelector("input").focus();
  } else {
    li.querySelector("input").value = ""; // la última casilla no se quita: se vacía
    li.querySelector("input").focus();
  }
  resetReview();
});

$("g-boxes").addEventListener("input", resetReview);

$("g-add-box").addEventListener("click", () => {
  const last = boxInputs().at(-1);
  (last.value.trim() ? addBoxesAfter(last.closest("li"), [""]) : last).focus();
});

// RF-2: «Subir lista» revisa y, si no hay problemas, guarda: crea el grupo o le añade los alumnos.
$("g-add").addEventListener("submit", async (event) => {
  event.preventDefault();
  showMessage("", "");
  const names = boxNames();
  if (currentGroup && names.length === 0) return showMessage("error", "Escribe al menos un nombre.");
  const save = $("g-save");
  save.disabled = true;
  try {
    let students = []; // RF-8b: un grupo nuevo puede guardarse sin alumnos
    if (names.length) {
      const review = await reviewBoxes();
      if (!review.canSave) return;
      if (review.similar.length && !similarAccepted) {
        similarAccepted = true; // CA-24: los parecidos se enseñan y hay que pulsar otra vez
        save.textContent = "Subir igualmente";
        return;
      }
      students = review.students;
    }
    const res = currentGroup
      ? await api(`/api/groups/${encodeURIComponent(currentGroup.id)}/students`, {
          method: "POST",
          body: JSON.stringify({ names: students }),
        })
      : await api("/api/groups", {
          method: "POST",
          body: JSON.stringify({ name: $("g-name").value, students }),
        });
    const data = await res.json();
    if (!res.ok) return showMessage("error", data.error);
    if (currentGroup) return reloadGroup();
    location.hash = hrefForGroup(data.id);
  } catch (error) {
    handleError(error);
  } finally {
    save.disabled = false;
  }
});

// RF-1b: «Revisar» lee el CSV y pone sus nombres en las casillas, detrás de los que ya había.
$("g-csv").addEventListener("submit", async (event) => {
  event.preventDefault();
  showMessage("", "");
  const file = $("g-file").files[0];
  if (!file) return showMessage("error", "Elige primero un archivo CSV.");
  try {
    const res = await api("/api/groups/preview", {
      method: "POST",
      body: JSON.stringify({ text: await readFile(file), source: "csv", groupId: currentGroup?.id }),
    });
    const data = await res.json();
    const found = [...data.students, ...data.duplicates, ...data.tooLong];
    if (!found.length) return showMessage("error", "No hay nombres en ese archivo.");
    setBoxes([...boxNames(), ...found]);
    resetReview();
    $("g-file").value = "";
    await reviewBoxes();
  } catch (error) {
    if (error instanceof AuthError) return handleError(error);
    showMessage("error", "No se pudo leer el archivo. ¿Es un CSV?");
  }
});

// ---------- descarga (CA-14) ----------

async function downloadCsv(sessionId) {
  const res = await api(`/api/sessions/${encodeURIComponent(sessionId)}/export`);
  if (!res.ok) throw new Error("export");
  const blob = await res.blob();
  const filename =
    /filename="([^"]+)"/.exec(res.headers.get("Content-Disposition") || "")?.[1] || "asistencia.csv";
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
  const key = JSON.stringify([data.checkins, data.newcomers, data.absent, pendingRemoval]);
  if (key === renderedListKey) return;
  renderedListKey = key;

  const hasGroup = Boolean(data.group);
  if (hasGroup) {
    // spec 007, RF-18: «X de N presentes», con los nuevos aparte
    $("s-total").textContent = `${data.presentCount} de ${data.rosterSize} presentes · ${data.group.name}`
      + (data.group.deleted ? " (grupo borrado)" : "");
    $("s-list").replaceChildren(...data.present.map(checkinRow));
    $("s-new-card").hidden = data.newcomers.length === 0;
    $("s-new").replaceChildren(...data.newcomers.map((c) => newcomerRow(c, data.group)));
    $("s-absent-card").hidden = data.absent.length === 0;
    $("s-absent-title").textContent = data.open ? `Faltan (${data.absent.length})` : `Ausentes (${data.absent.length})`;
    $("s-absent").replaceChildren(...data.absent.map((name) => {
      const li = document.createElement("li");
      li.textContent = name;
      return li;
    }));
  } else {
    $("s-total").textContent =
      data.total === 1 ? "1 alumno registrado" : `${data.total} alumnos registrados`;
    $("s-list").replaceChildren(...data.checkins.map(checkinRow));
    $("s-new-card").hidden = true;
    $("s-absent-card").hidden = true;
  }

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
    question.textContent = currentSession?.group
      ? `¿Liberar el nombre ${c.name}? Podrá volver a elegirlo.` // spec 007, RF-19
      : `¿Quitar a ${c.name}?`; // CA-12: texto literal
    const actions = document.createElement("span");
    actions.className = "row-actions";
    actions.append(
      button(currentSession?.group ? "Sí, liberar" : "Sí, quitar", "danger-solid small", "confirm", c.id),
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
  const label = currentSession?.group ? "Liberar" : "Quitar";
  const remove = button(label, "danger small", "remove", c.id);
  remove.setAttribute("aria-label", `${label} a ${c.name}`);
  actions.append(time, remove);
  li.append(name, actions);
  return li;
}

// spec 007, RF-20: decidir sobre cada nuevo, también con la sesión cerrada.
function newcomerRow(c, group) {
  const li = document.createElement("li");
  const name = document.createElement("span");
  name.className = "name";
  name.textContent = c.name;
  const actions = document.createElement("span");
  actions.className = "row-actions";
  actions.style.flexWrap = "wrap";
  const time = document.createElement("span");
  time.className = "meta";
  time.textContent = hhmm(c.checkedAt);
  actions.append(time);
  if (c.decided) {
    const done = document.createElement("span");
    done.className = "meta";
    done.textContent = "✓ decidido";
    actions.append(done);
  } else {
    if (!group.deleted) actions.append(button("Añadir al grupo", "small", "new-add", c.id));
    actions.append(button("Dejar solo aquí", "secondary small", "new-keep", c.id));
  }
  actions.append(button("Descartar", "danger small", "new-discard", c.id));
  li.append(name, actions);
  return li;
}

$("s-new").addEventListener("click", async (event) => {
  const target = event.target.closest("button[data-action]");
  if (!target || !currentSession) return;
  const action = { "new-add": "add", "new-keep": "keep", "new-discard": "discard" }[target.dataset.action];
  target.disabled = true;
  $("s-new-msg").hidden = true;
  try {
    const res = await api(
      `/api/sessions/${encodeURIComponent(currentSession.id)}/checkins/${target.dataset.id}/decision`,
      { method: "POST", body: JSON.stringify({ action }) },
    );
    const data = await res.json();
    if (!res.ok) {
      $("s-new-msg").textContent = data.error; // p. ej. «Este grupo ya tiene 200 alumnos» (CA-20)
      $("s-new-msg").hidden = false;
    } else if (data.result === "linked") {
      $("s-new-msg").textContent = "Ya está en el grupo: se ha unido a ese alumno.";
      $("s-new-msg").hidden = false;
    }
    renderedListKey = "";
    await poll();
  } catch (error) {
    handleError(error);
  }
});

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
  $("group-back").href = hrefFor();
  $("new-group").href = hrefForGroup("new");
  $("open-error").hidden = true;
  $("s-new-msg").hidden = true;
  pendingGroupAction = null;

  if (!token()) {
    showView(null);
    showMessage("error", "Falta el enlace secreto. Abre el enlace del panel que aparece en la terminal al arrancar la app.");
    return;
  }
  try {
    if (hashParams().get("g")) {
      currentSession = null;
      await renderGroupView(hashParams().get("g"));
    } else if (hashParams().get("s")) {
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
