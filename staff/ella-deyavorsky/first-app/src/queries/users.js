/* global fetch, window */
// In the browser the page already comes from the database program, so a
// relative address works from http://127.0.0.1:3000 and http://localhost:3000.
// Node has no page address, so it needs the full one.
let DATABASE_URL = "http://127.0.0.1:3000";
if (typeof window !== "undefined") {
  DATABASE_URL = "";
}

export async function createUsersTable() {
  try {
    const response = await fetch(DATABASE_URL + "/queries/create-users-table", {
      method: "POST",
      body: JSON.stringify({}),
    });
    if (!response.ok) {
      throw new Error("The database program answered with an error.");
    }
  } catch {
    throw new Error("The database failed.");
  }
}

export async function insert(input) {
  try {
    const response = await fetch(DATABASE_URL + "/queries/insert", {
      method: "POST",
      body: JSON.stringify({ name: input.name, email: input.email }),
    });
    if (!response.ok) {
      throw new Error("The database program answered with an error.");
    }
    return await response.json();
  } catch {
    throw new Error("The database failed.");
  }
}

export async function findById(id) {
  try {
    const response = await fetch(DATABASE_URL + "/queries/find-by-id", {
      method: "POST",
      body: JSON.stringify({ id }),
    });
    if (!response.ok) {
      throw new Error("The database program answered with an error.");
    }
    return await response.json();
  } catch {
    throw new Error("The database failed.");
  }
}

export async function findByEmail(email) {
  try {
    const response = await fetch(DATABASE_URL + "/queries/find-by-email", {
      method: "POST",
      body: JSON.stringify({ email }),
    });
    if (!response.ok) {
      throw new Error("The database program answered with an error.");
    }
    return await response.json();
  } catch {
    throw new Error("The database failed.");
  }
}

export async function findAll() {
  try {
    const response = await fetch(DATABASE_URL + "/queries/find-all", {
      method: "POST",
      body: JSON.stringify({}),
    });
    if (!response.ok) {
      throw new Error("The database program answered with an error.");
    }
    return await response.json();
  } catch {
    throw new Error("The database failed.");
  }
}

export async function update(input) {
  try {
    const response = await fetch(DATABASE_URL + "/queries/update", {
      method: "POST",
      body: JSON.stringify({
        id: input.id,
        name: input.name,
        email: input.email,
      }),
    });
    if (!response.ok) {
      throw new Error("The database program answered with an error.");
    }
    return await response.json();
  } catch {
    throw new Error("The database failed.");
  }
}

export async function remove(id) {
  try {
    const response = await fetch(DATABASE_URL + "/queries/remove", {
      method: "POST",
      body: JSON.stringify({ id }),
    });
    if (!response.ok) {
      throw new Error("The database program answered with an error.");
    }
  } catch {
    throw new Error("The database failed.");
  }
}
