const SQL_FILES = [
  "find-all-users.sql",
  "find-user-by-id.sql",
  "find-user-by-email.sql",
  "find-users-by-name.sql",
  "search-users.sql",
  "insert-user.sql",
  "update-user.sql",
  "delete-user.sql",
];

async function read(path) {
  const response = await fetch(new URL(path, import.meta.url));
  return response.text();
}

const SQL = await initSqlJs({
  locateFile: (file) =>
    new URL(`../../node_modules/sql.js/dist/${file}`, import.meta.url).href,
});
const SCHEMA = await read("../../db/schema.sql");
const QUERIES = Object.fromEntries(
  await Promise.all(
    SQL_FILES.map(async (file) => [
      file,
      await read(`../../queries/queries/${file}`),
    ]),
  ),
);

let db;

function sql(file) {
  return QUERIES[file];
}

// sql.js binds named parameters with their prefix: { ":id": 1 }
function params(values) {
  return Object.fromEntries(
    Object.entries(values).map(([key, value]) => [`:${key}`, value]),
  );
}

function all(file, values = {}) {
  const statement = db.prepare(sql(file));
  try {
    statement.bind(params(values));
    const rows = [];
    while (statement.step()) {
      rows.push(statement.getAsObject());
    }
    return rows;
  } finally {
    statement.free();
  }
}

function run(file, values) {
  db.run(sql(file), params(values));
}

export function load(bytes) {
  db?.close();
  db = new SQL.Database(bytes);
  db.exec(SCHEMA);
}

export function dump() {
  return db.export();
}

export function createUsersTable() {
  db.exec(SCHEMA);
}

export function findAll() {
  return all("find-all-users.sql");
}

export function findById(id) {
  return all("find-user-by-id.sql", { id })[0];
}

export function findByEmail(email) {
  return all("find-user-by-email.sql", { email })[0];
}

export function findByName(name) {
  return all("find-users-by-name.sql", { name });
}

export function search(text) {
  return all("search-users.sql", { text });
}

// sql.js has no lastInsertRowid; the email is unique, so it finds the new row
export function insert(name, email) {
  run("insert-user.sql", { name, email });
  return findByEmail(email);
}

export function update(id, name, email) {
  run("update-user.sql", { id, name, email });
  return findById(id);
}

export function remove(id) {
  run("delete-user.sql", { id });
}
