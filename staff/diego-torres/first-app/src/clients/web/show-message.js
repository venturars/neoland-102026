export function showMessage(text, isError) {
  const message = document.getElementById("message");
  message.textContent = text;
  message.classList.toggle("error", isError);
  message.hidden = text === "";
}
