import { AppError, DuplicateError, SystemError } from '../logic/errors.js'

const UNIQUE = /UNIQUE constraint failed: \w+\.(\w+)/

export const safe = (fn) => (...args) => {
  try {
    return fn(...args)
  } catch (error) {
    if (error instanceof AppError) throw error
    const field = error.message.match(UNIQUE)?.[1]
    if (field) {
      const value = args.find((arg) => arg && typeof arg === 'object')?.[field]
      throw new DuplicateError(`${field} already exists`, { field, value }, { cause: error })
    }
    throw new SystemError('database error', {}, { cause: error })
  }
}
