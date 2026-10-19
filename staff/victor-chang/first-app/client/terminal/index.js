import { fileURLToPath } from 'node:url'
import { openDatabase } from '../../db/sqlite.js'
import { createQueries } from '../../query/index.js'
import { createUser } from '../../logic/createUser.js'
import { updateUser } from '../../logic/updateUser.js'
import { deleteUser } from '../../logic/deleteUser.js'
import { getUser } from '../../logic/getUser.js'
import { listUsers } from '../../logic/listUsers.js'

const queries = createQueries(openDatabase(fileURLToPath(new URL('../../db/users.db', import.meta.url))))

const commands = {
  create: (name, email) => createUser(queries)({ name, email }),
  list: () => listUsers(queries)(),
  get: (id) => getUser(queries)(Number(id)),
  update: (id, name, email) => updateUser(queries)(Number(id), { name, email }),
  delete: (id) => deleteUser(queries)(Number(id)) ?? { deleted: Number(id) },
}

const [command, ...args] = process.argv.slice(2)

try {
  if (!commands[command]) throw new Error(`usage: ${Object.keys(commands).join(' | ')} [args]`)
  console.log(JSON.stringify(commands[command](...args), null, 2))
} catch (error) {
  console.error(JSON.stringify({ error: { type: error.constructor.name, message: error.message } }))
  process.exitCode = 1
}
