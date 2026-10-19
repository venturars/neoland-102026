import { DuplicateError } from './errors.js'
import { validateUser } from './validate.js'

export const createUser = (queries) => (input) => {
  const user = validateUser(input)
  if (queries.findUserByEmail(user.email)) throw new DuplicateError('email already exists')
  return queries.insertUser(user)
}
