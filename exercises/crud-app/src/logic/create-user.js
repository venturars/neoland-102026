import { EmailInUseError } from '../errors.js';
import { failure, validateUserInput } from './validation.js';

export function createUser(input, users) {
  const result = validateUserInput(input);
  if (!result.ok) return result;
  try {
    const user = users.createUser(result.data);
    return { ok: true, data: user };
  } catch (error) {
    if (error instanceof EmailInUseError) {
      return failure('EMAIL_IN_USE', 'Email is already in use.', 'email');
    }
    throw error;
  }
}
