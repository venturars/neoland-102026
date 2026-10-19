import { NotFoundError } from './errors.js'

export const getUser = (queries) => (id) => {
  const user = queries.findUserById(id)
  if (!user) throw new NotFoundError('user not found')
  return user
}
