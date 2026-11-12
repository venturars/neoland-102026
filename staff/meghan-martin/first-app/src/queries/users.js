// Asks the database program for a query by name.
// This file does not open the database and does not decide if an email is valid.

const DATABASE_URL = "http://127.0.0.1:3000/query";

async function runQuery(query, params) {
  let response;
  try {
    response = await fetch(DATABASE_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ query, params }),
    });
  } catch (error) {
    throw new Error("Database is not running. Start it with npm run db.", {
      cause: error,
    });
  }

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.error);
  }
  return data;
}

export async function createUsersTable() {
  const data = await runQuery("createUsersTable", {});
  return data.rows;
}

export async function findById(id) {
  const data = await runQuery("findById", { id });
  if (data.row === null) {
    return undefined;
  }
  return data.row;
}

export async function findByEmail(email) {
  const data = await runQuery("findByEmail", { email });
  if (data.row === null) {
    return undefined;
  }
  return data.row;
}

export async function insert({ name, email }) {
  const data = await runQuery("insert", { name, email });
  return data.row;
}

export async function update({ id, name, email }) {
  const data = await runQuery("update", { id, name, email });
  return data.row;
}

export async function remove(id) {
  await runQuery("remove", { id });
}

export async function findAll() {
  const data = await runQuery("findAll", {});
  return data.rows;
}
