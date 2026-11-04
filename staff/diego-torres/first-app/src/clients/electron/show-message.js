// Muestra un mensaje en pantalla, con estilo de error si isError es true.
export function showMessage(text, isError) {
  // Pone el texto y el estilo, y oculta el mensaje si el texto está vacío.
  const message = document.getElementById("message");
  message.textContent = text;
  message.classList.toggle("error", isError);
  message.hidden = text === "";
}
