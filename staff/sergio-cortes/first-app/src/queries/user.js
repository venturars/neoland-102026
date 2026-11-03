const DATABASE_URL = "http://127.0.0.1:3000";

const httpFetch = globalThis.fetch;

async function requestQuery(body) {
  const url = `${DATABASE_URL}/execute`;
  const response = await httpFetch(url, {
    method: "POST",
    headers: {
      "content-type": "application/json",
    },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    throw new Error("Database request failed");
  }

  const data = await response.json();

  if (data === null) {
    return undefined;
  }

  return data;
}

export async function createUsersTable() {
  return requestQuery({
    method: "exec",
    file: "create-users-table.sql",
    params: {},
  });
}

export async function insert(user) {
  return requestQuery({
    method: "get",
    file: "insert.sql",
    params: {
      name: user.name,
      email: user.email,
    },
  });
}

export async function findById(id) {
  return requestQuery({
    method: "get",
    file: "find-by-id.sql",
    params: { id },
  });
}

export async function findByEmail(email) {
  return requestQuery({
    method: "get",
    file: "find-by-email.sql",
    params: { email },
  });
}

export async function findByName(name) {
  return requestQuery({
    method: "all",
    file: "find-by-name.sql",
    params: { name },
  });
}

export async function findAll() {
  return requestQuery({
    method: "all",
    file: "find-all.sql",
    params: {},
  });
}

export async function update(user) {
  return requestQuery({
    method: "get",
    file: "update.sql",
    params: {
      name: user.name,
      email: user.email,
      id: user.id,
    },
  });
}

export async function remove(id) {
  return requestQuery({
    method: "run",
    file: "remove.sql",
    params: { id },
  });
}
