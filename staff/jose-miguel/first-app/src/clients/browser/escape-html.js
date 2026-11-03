export function escapeHtml(text) {
  const asText = String(text);
  let escaped = asText;
  escaped = escaped.replaceAll("&", "&amp;");
  escaped = escaped.replaceAll("<", "&lt;");
  escaped = escaped.replaceAll(">", "&gt;");
  escaped = escaped.replaceAll('"', "&quot;");
  return escaped;
}
