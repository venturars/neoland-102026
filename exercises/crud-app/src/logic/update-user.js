import { EmailInUseError } from '../errors.js';
import { failure, validateId, validateUserInput } from './validation.js';

export function updateUser(id, input, users) {
  const invalidId = validateId(id);
  if (invalidId) return invalidId;
  const result = validateUserInput(input, true);
  if (!result.ok) return result;
  const existing = users.findUserById(id);
  if (!existing) return failure('NOT_FOUND', 'User not found.');
  try {
    const user = users.updateUser(id, { ...existing, ...result.data });
    return user === undefined
      ? failure('NOT_FOUND', 'User not found.')
      : { ok: true, data: user };
  } catch (error) {
    if (error instanceof EmailInUseError) {
      return failure('EMAIL_IN_USE', 'Email is already in use.', 'email');
    }
    throw error;
  }
}
