import { createServer } from "node:http";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { listUsers } from "../../logic/list-users.js";
import { findUserById } from "../../logic/find-user-by-id.js";
import { updateUser } from "../../logic/update-user.js";
import { deleteUser } from "../../logic/delete-user.js";

const fileUrl = import.meta.url;
const filePath = fileURLToPath(fileUrl);
const directory = dirname(filePath);
const host = "127.0.0.1";
const port = 3000;

function escapeText(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function readPage(name) {
  const pagePath = join(directory, name);
  return readFileSync(pagePath, "utf8");
}

function fill(template, values) {
  let text = template;
  const keys = Object.keys(values);
  for (const key of keys) {
    text = text.replaceAll(`{{${key}}}`, values[key]);
  }
  return text;
}

function sendHtml(response, status, html) {
  response.writeHead(status, {
    "Content-Type": "text/html; charset=utf-8",
  });
  response.end(html);
}

function sendFile(response, name, type) {
  const body = readPage(name);
  response.writeHead(200, { "Content-Type": type });
  response.end(body);
}

function redirect(response, location) {
  response.writeHead(303, { Location: location });
  response.end();
}

function readId(value) {
  if (typeof value !== "string") {
    return null;
  }
  if (!/^[1-9][0-9]*$/.test(value)) {
    return null;
  }
  return Number(value);
}

function readBody(request) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    request.on("data", (chunk) => {
      chunks.push(chunk);
    });
    request.on("end", () => {
      const raw = Buffer.concat(chunks).toString("utf8");
      resolve(new URLSearchParams(raw));
    });
    request.on("error", reject);
  });
}

function listPage(error) {
  let rows = "";
  let pageError = error;
  try {
    const people = listUsers();
    if (people.length === 0) {
      rows = '<p class="empty">There are no people yet.</p>';
    }
    for (const person of people) {
      const id = escapeText(person.id);
      const name = escapeText(person.name);
      const email = escapeText(person.email);
      rows +=
        `<a class="row" href="/user?id=${id}">` +
        `<span>${id}</span>` +
        `<span>${name}</span>` +
        `<span>${email}</span>` +
        "</a>";
    }
  } catch (caught) {
    if (pageError === "") {
      pageError = caught.message;
    }
  }
  const html = fill(readPage("list.html"), {
    error: escapeText(pageError),
    rows,
  });
  return html;
}

function optionsPage(id) {
  let name = "";
  let email = "";
  let error = "";
  let edit = "";
  try {
    const person = findUserById(id);
    name = escapeText(person.name);
    email = escapeText(person.email);
    edit = `<a href="/user/edit?id=${escapeText(person.id)}">Edit</a>`;
  } catch (caught) {
    error = escapeText(caught.message);
  }
  return fill(readPage("options.html"), {
    name,
    email,
    error,
    edit,
  });
}

function editPage(person, error) {
  return fill(readPage("edit.html"), {
    id: escapeText(person.id),
    name: escapeText(person.name),
    email: escapeText(person.email),
    error: escapeText(error),
  });
}

async function handle(request, response) {
  const url = new URL(request.url, `http://${host}`);
  const path = url.pathname;

  if (request.method === "GET" && path === "/styles.css") {
    sendFile(response, "styles.css", "text/css; charset=utf-8");
    return;
  }
  if (request.method === "GET" && path === "/") {
    sendHtml(response, 200, listPage(""));
    return;
  }
  if (request.method === "GET" && path === "/user") {
    const id = readId(url.searchParams.get("id"));
    if (id === null) {
      sendHtml(response, 400, listPage("Invalid id"));
      return;
    }
    sendHtml(response, 200, optionsPage(id));
    return;
  }
  if (request.method === "GET" && path === "/user/edit") {
    const id = readId(url.searchParams.get("id"));
    if (id === null) {
      sendHtml(response, 400, listPage("Invalid id"));
      return;
    }
    try {
      const person = findUserById(id);
      sendHtml(response, 200, editPage(person, ""));
    } catch (caught) {
      sendHtml(response, 404, listPage(caught.message));
    }
    return;
  }
  if (request.method === "POST" && path === "/user/edit") {
    const body = await readBody(request);
    const id = readId(body.get("id"));
    const name = body.get("name") ?? "";
    const email = body.get("email") ?? "";
    if (id === null) {
      sendHtml(response, 400, listPage("Invalid id"));
      return;
    }
    try {
      updateUser(id, { name, email });
      redirect(response, `/user?id=${id}`);
    } catch (caught) {
      sendHtml(response, 400, editPage({ id, name, email }, caught.message));
    }
    return;
  }
  if (request.method === "GET" && path === "/user/delete") {
    const id = readId(url.searchParams.get("id"));
    if (id === null) {
      sendHtml(response, 400, listPage("Invalid id"));
      return;
    }
    try {
      const person = findUserById(id);
      const html = fill(readPage("delete.html"), {
        id: escapeText(person.id),
        name: escapeText(person.name),
        email: escapeText(person.email),
      });
      sendHtml(response, 200, html);
    } catch (caught) {
      sendHtml(response, 404, listPage(caught.message));
    }
    return;
  }
  if (request.method === "POST" && path === "/user/delete") {
    const body = await readBody(request);
    const id = readId(body.get("id"));
    if (id === null) {
      sendHtml(response, 400, listPage("Invalid id"));
      return;
    }
    try {
      deleteUser(id);
      redirect(response, "/");
    } catch (caught) {
      sendHtml(response, 400, listPage(caught.message));
    }
    return;
  }

  sendHtml(response, 404, listPage("That page is not here."));
}

const server = createServer((request, response) => {
  handle(request, response).catch(() => {
    if (response.headersSent) {
      return;
    }
    response.writeHead(500, {
      "Content-Type": "text/plain; charset=utf-8",
    });
    response.end("Something went wrong");
  });
});

server.listen(port, host, () => {
  console.log(`Open http://${host}:${port}`);
});
