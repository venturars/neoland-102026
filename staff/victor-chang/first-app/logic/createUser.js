import { DuplicateError } from './errors.js'
import { validateUser } from './validateUser.js'

export const createUser = (queries) => (input) => {
  const user = validateUser(input)
  if (queries.findUserByEmail(user.email)) throw new DuplicateError('email already exists', { field: 'email', value: user.email })
  return queries.insertUser(user)
}
