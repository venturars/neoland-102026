import { ValidationError } from './errors.js'

export function validateUser({ name, email }) {
  if (typeof name !== 'string' || !name.trim()) throw new ValidationError('name is required')
  if (typeof email !== 'string' || !email.includes('@')) throw new ValidationError('email is invalid')
  return { name: name.trim(), email: email.trim() }
}
