// AsistenciApp student check-in flow: name, code and confirmation.

const NAME_KEY = "asistenciapp.nombre";
const sessionId = new URLSearchParams(location.search).get("s");

const titleElement = document.getElementById("title");
const statusElement = document.getElementById("status");
const form = document.getElementById("form");
const nameStep = document.getElementById("name-step");
const codeStep = document.getElementById("code-step");
const doneStep = document.getElementById("done-step");
const nameInput = document.getElementById("name");
const codeInput = document.getElementById("code");
const codeDigits = [...document.querySelectorAll("[data-code-digit]")];
const submitButton = document.getElementById("submit");

function showMessage(kind, text) {
  statusElement.replaceChildren();
  if (!text) return;
  const message = document.createElement("p");
  message.className = `message ${kind}`;
  message.textContent = text;
  statusElement.append(message);
}

function timeOnly(isoDate) {
  return new Date(isoDate).toLocaleTimeString("es-ES", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

function updateStepMarkers(activeStep) {
  const stepOrder = ["name", "code", "done"];
  const activeIndex = stepOrder.indexOf(activeStep);
  for (const marker of document.querySelectorAll("[data-step-marker]")) {
    const markerIndex = stepOrder.indexOf(marker.dataset.stepMarker);
    marker.classList.toggle("active", markerIndex === activeIndex);
    marker.classList.toggle("completed", markerIndex < activeIndex);
    if (markerIndex === activeIndex) marker.setAttribute("aria-current", "step");
    else marker.removeAttribute("aria-current");
  }
}

function showStep(step, moveFocus = true) {
  form.hidden = step === "done";
  nameStep.hidden = step !== "name";
  codeStep.hidden = step !== "code";
  doneStep.hidden = step !== "done";
  updateStepMarkers(step);

  if (!moveFocus) return;
  if (step === "name") nameInput.focus();
  if (step === "code") codeInput.focus();
  if (step === "done") doneStep.focus({ preventScroll: true });
}

// The registration marker belongs to one class and stays only in this browser.
function registrationKey() {
  return `asistenciapp.registro.${sessionId}`;
}

function savedRegistration() {
  try {
    return JSON.parse(localStorage.getItem(registrationKey()));
  } catch {
    return null;
  }
}

function saveRegistration(data) {
  try {
    localStorage.setItem(
      registrationKey(),
      JSON.stringify({ name: data.name, checkedAt: data.checkedAt }),
    );
  } catch {
    // Registration still succeeds when this browser does not allow local storage.
  }
}

function rememberedName() {
  try {
    return localStorage.getItem(NAME_KEY) || "";
  } catch {
    return "";
  }
}

function rememberName(name) {
  try {
    localStorage.setItem(NAME_KEY, name);
  } catch {
    // Remembering the name is optional and never changes the server registration.
  }
}

function showCompletedRegistration(registration, alreadyRegistered = false) {
  showMessage("", "");
  const time = timeOnly(registration.checkedAt);
  const doneMessage = document.getElementById("done-message");
  if (alreadyRegistered) {
    doneMessage.textContent = `Ya estabas registrado como ${registration.name} a las ${time}.`;
  } else {
    doneMessage.textContent = `${registration.name}, te hemos registrado a las ${time}.`;
  }
  doneStep.tabIndex = -1;
  showStep("done");
}

function continueToCode() {
  showMessage("", "");
  const cleanName = nameInput.value.trim();
  if (!cleanName) {
    showMessage("error", "Escribe tu nombre antes de continuar.");
    nameInput.focus();
    return;
  }
  if (cleanName.length > 60) {
    showMessage("error", "El nombre no puede tener más de 60 caracteres.");
    nameInput.focus();
    return;
  }

  nameInput.value = cleanName;
  document.getElementById("name-summary").textContent = cleanName;
  showStep("code");
}

function updateCodeDigits() {
  for (const [index, digit] of codeDigits.entries()) {
    digit.textContent = codeInput.value[index] || "";
  }
}

async function loadSession() {
  if (!sessionId) {
    titleElement.textContent = "Enlace incompleto";
    showMessage("error", "Falta el identificador de la clase en el enlace. Pide el enlace a tu profesor.");
    return;
  }

  try {
    const response = await fetch(`/api/s/${encodeURIComponent(sessionId)}`);
    const data = await response.json();
    if (!response.ok) {
      titleElement.textContent = "Clase no encontrada";
      showMessage("error", data.error);
      return;
    }

    titleElement.textContent = data.title;
    const registration = savedRegistration();
    if (registration?.name && registration?.checkedAt) {
      showCompletedRegistration(registration, true);
      return;
    }
    if (!data.open) {
      showMessage("error", "La asistencia de esta clase ya está cerrada.");
      return;
    }

    nameInput.value = rememberedName();
    showStep("name");
  } catch {
    titleElement.textContent = "Sin conexión";
    showMessage("error", "No se pudo conectar. Revisa tu conexión y recarga la página.");
  }
}

document.getElementById("continue-name").addEventListener("click", continueToCode);

nameInput.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    event.preventDefault();
    continueToCode();
  }
});

document.getElementById("edit-name").addEventListener("click", () => {
  showMessage("", "");
  showStep("name");
  nameInput.select();
});

codeInput.addEventListener("input", () => {
  codeInput.value = codeInput.value.replace(/[^0-9]/g, "").slice(0, 4);
  updateCodeDigits();
});

form.addEventListener("submit", async (event) => {
  event.preventDefault();
  showMessage("", "");
  if (codeInput.value.length !== 4) {
    showMessage("error", "El código tiene cuatro cifras.");
    codeInput.focus();
    return;
  }

  submitButton.disabled = true;
  try {
    const response = await fetch(`/api/s/${encodeURIComponent(sessionId)}/checkin`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: nameInput.value, code: codeInput.value }),
    });
    const data = await response.json();

    if (response.status === 201) {
      rememberName(data.name);
      saveRegistration(data);
      showCompletedRegistration(data);
      return;
    }
    if (response.ok && data.already) {
      showCompletedRegistration(data, true);
      return;
    }
    if (response.status === 409) {
      form.hidden = true;
      showMessage("error", data.error);
      return;
    }

    let invalidInput = codeInput;
    if (response.status === 400) {
      showStep("name", false);
      invalidInput = nameInput;
    } else {
      showStep("code", false);
    }
    showMessage("error", data.error);
    invalidInput.select();
  } catch {
    showMessage("error", "No se pudo conectar. Revisa tu conexión e inténtalo de nuevo.");
  } finally {
    submitButton.disabled = false;
  }
});

updateCodeDigits();
loadSession();
