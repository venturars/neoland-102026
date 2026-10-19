import { NotFoundError } from './errors.js'

export const deleteUser = (queries) => (id) => {
  if (!queries.findUserById(id)) throw new NotFoundError('user not found', { resource: 'user', id })
  queries.removeUser(id)
}
