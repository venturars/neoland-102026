import { fileURLToPath } from 'node:url'
import { openDatabase } from '../../db/sqlite.js'
import { createQueries } from '../../query/index.js'
import { createUser } from '../../logic/createUser.js'
import { updateUser } from '../../logic/updateUser.js'
import { deleteUser } from '../../logic/deleteUser.js'
import { getUser } from '../../logic/getUser.js'
import { listUsers } from '../../logic/listUsers.js'
import { AppError, ValidationError } from '../../logic/errors.js'

const DB_PATH = process.env.DB_PATH ?? fileURLToPath(new URL('../../db/users.db', import.meta.url))
const EXIT_CODES = { VALIDATION: 2, NOT_FOUND: 3, DUPLICATE: 4, SYSTEM: 1 }

const parseId = (value) => {
  const id = Number(value)
  if (!Number.isInteger(id) || id < 1) throw new ValidationError('id must be a positive integer', { field: 'id' })
  return id
}

const commands = {
  create: { usage: 'create <name> <email>', run: (queries, name, email) => createUser(queries)({ name, email }) },
  list: { usage: 'list', run: (queries) => listUsers(queries)() },
  get: { usage: 'get <id>', run: (queries, id) => getUser(queries)(parseId(id)) },
  update: { usage: 'update <id> <name> <email>', run: (queries, id, name, email) => updateUser(queries)(parseId(id), { name, email }) },
  delete: { usage: 'delete <id>', run: (queries, id) => deleteUser(queries)(parseId(id)) ?? { deleted: Number(id) } },
}

const usage = Object.values(commands).map((command) => command.usage).join(' | ')

const run = ([name, ...args]) => {
  const command = commands[name]
  if (!command) throw new ValidationError(`usage: ${usage}`, { field: 'command' })
  if (args.length !== command.run.length - 1) throw new ValidationError(`usage: ${command.usage}`, { field: 'args' })
  return command.run(createQueries(openDatabase(DB_PATH)), ...args)
}

const toOutput = (error) => error instanceof AppError
  ? { code: error.code, message: error.message, details: error.details }
  : { code: 'SYSTEM', message: 'unexpected error', details: {} }

try {
  console.log(JSON.stringify(run(process.argv.slice(2)), null, 2))
} catch (error) {
  const output = toOutput(error)
  console.error(JSON.stringify({ error: output }))
  if (process.env.DEBUG === '1') console.error(error)
  process.exitCode = EXIT_CODES[output.code]
}
