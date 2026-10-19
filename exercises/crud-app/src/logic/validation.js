export function failure(code, message, field) {
  return { ok: false, error: { code, message, ...(field ? { field } : {}) } };
}

export function validateId(id) {
  if (!Number.isSafeInteger(id) || id < 1) {
    return failure('VALIDATION_ERROR', 'ID must be a positive integer.', 'id');
  }
}

export function validateUserInput(input, partial = false) {
  if (input === null || typeof input !== 'object' || Array.isArray(input)) {
    return failure('VALIDATION_ERROR', 'Provide an object with user fields.');
  }
  const keys = Object.keys(input);
  if (keys.some(key => !['name', 'email'].includes(key))) {
    return failure('VALIDATION_ERROR', 'Only name and email are allowed.');
  }
  if (partial && keys.length === 0) {
    return failure('VALIDATION_ERROR', 'Provide at least one field to update.');
  }
  const data = {};
  for (const field of ['name', 'email']) {
    if (partial && !Object.hasOwn(input, field)) continue;
    if (!Object.hasOwn(input, field) || typeof input[field] !== 'string') {
      return failure('VALIDATION_ERROR', `${field} must be a string.`, field);
    }
    const trimmed = input[field].trim();
    const value = field === 'email' ? trimmed.toLowerCase() : trimmed;
    const length = Array.from(value).length;
    if (field === 'name' && (length < 1 || length > 100)) {
      return failure('VALIDATION_ERROR', 'Name must contain 1–100 characters.', field);
    }
    if (field === 'email' && (length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value))) {
      return failure('VALIDATION_ERROR', 'Provide a valid email up to 254 characters.', field);
    }
    if (value.includes('\0')) {
      return failure('VALIDATION_ERROR', 'Null characters are not allowed.', field);
    }
    data[field] = value;
  }
  return { ok: true, data };
}
