import { parseArgs } from 'node:util';
import { openApp } from './app.js';

const help = `Usage:
  npm run users -- create --name "Ana" --email ana@example.com
  npm run users -- list
  npm run users -- update 1 --name "Ana Lopez"
  npm run users -- delete 1
Run npm run db:init first.`;

function parseCommand(args) {
  const [command, ...rest] = args;
  if (!['create', 'list', 'update', 'delete'].includes(command)) {
    throw new Error('Choose create, list, update, or delete.');
  }
  const acceptsFields = command === 'create' || command === 'update';
  const { values, positionals } = parseArgs({
    args: rest,
    options: acceptsFields ? { name: { type: 'string' }, email: { type: 'string' } } : {},
    allowPositionals: true,
    strict: true,
  });
  const needsId = command === 'update' || command === 'delete';
  if (positionals.length !== (needsId ? 1 : 0)) {
    throw new Error(needsId ? 'Provide exactly one user ID.' : 'Unexpected positional argument.');
  }
  if (needsId && !/^[1-9][0-9]*$/.test(positionals[0])) {
    throw new Error('ID must be a positive integer.');
  }
  return { command, input: { ...values }, id: needsId ? Number(positionals[0]) : undefined };
}

function main() {
  const args = process.argv.slice(2);
  if (args.length === 0 || (args.length === 1 && ['--help', '-h'].includes(args[0]))) {
    console.log(help);
    return;
  }
  let request;
  try {
    request = parseCommand(args);
  } catch (error) {
    console.error(error.message);
    console.error(help);
    process.exitCode = 1;
    return;
  }
  let app;
  try {
    app = openApp();
    let result;
    switch (request.command) {
      case 'create': result = app.createUser(request.input); break;
      case 'list': result = app.listUsers(); break;
      case 'update': result = app.updateUser(request.id, request.input); break;
      case 'delete': result = app.deleteUser(request.id); break;
    }
    if (result.ok) console.log(JSON.stringify(result, null, 2));
    else {
      console.error(JSON.stringify(result, null, 2));
      process.exitCode = 1;
    }
  } catch {
    console.error('Database operation failed. Ensure npm run db:init has completed.');
    process.exitCode = 1;
  } finally {
    if (app) app.close();
  }
}

main();
