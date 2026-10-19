import { failure, validateId } from './validation.js';

export function deleteUser(id, users) {
  const invalidId = validateId(id);
  if (invalidId) return invalidId;
  const deleted = users.deleteUser(id);
  return deleted ? { ok: true, data: deleted } : failure('NOT_FOUND', 'User not found.');
}
