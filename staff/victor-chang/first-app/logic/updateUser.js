import { DuplicateError, NotFoundError } from './errors.js'
import { validateUser } from './validate.js'

export const updateUser = (queries) => (id, input) => {
  const user = validateUser(input)
  if (!queries.findUserById(id)) throw new NotFoundError('user not found')
  const same = queries.findUserByEmail(user.email)
  if (same && same.id !== id) throw new DuplicateError('email already exists')
  return queries.modifyUser(id, user)
}
