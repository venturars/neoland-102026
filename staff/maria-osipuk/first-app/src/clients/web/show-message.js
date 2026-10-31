export function showMessage(text, isError) {
  const message = document.getElementById("message");

  // Treat messages as text, even if a saved name contains HTML characters.
  message.textContent = text;
  message.hidden = text === "";
  message.classList.toggle("message-error", isError);
}
