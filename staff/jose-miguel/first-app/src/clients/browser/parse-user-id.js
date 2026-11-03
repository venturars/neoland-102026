export function parseUserId(rawId) {
  let idMissing = false;
  if (rawId === undefined) {
    idMissing = true;
  }
  if (rawId === null) {
    idMissing = true;
  }
  if (!idMissing) {
    const idAsText = String(rawId);
    const trimmedId = idAsText.trim();
    if (trimmedId === "") {
      idMissing = true;
    }
  }
  if (idMissing) {
    throw new Error("Invalid id");
  }

  const idAsText = String(rawId);
  const trimmedId = idAsText.trim();
  const hasOnlyDigits = /^[1-9][0-9]*$/.test(trimmedId);

  if (!hasOnlyDigits) {
    throw new Error("Invalid id");
  }

  const numericId = Number(trimmedId);

  if (!Number.isSafeInteger(numericId)) {
    throw new Error("Invalid id");
  }

  return numericId;
}
