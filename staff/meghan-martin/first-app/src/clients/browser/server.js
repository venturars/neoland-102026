// This file opens the People pages in the browser.
// It does not decide if a name or email is allowed.
// Those rules live in src/logic/. This file only calls them.

import { createServer } from "node:http";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { listUsers } from "../../logic/list-users.js";
import { findUserById } from "../../logic/find-user-by-id.js";
import { updateUser } from "../../logic/update-user.js";
import { deleteUser } from "../../logic/delete-user.js";

// The HTML and CSS files sit in this same folder.
const fileUrl = import.meta.url;
const filePath = fileURLToPath(fileUrl);
const directory = dirname(filePath);

// Only this computer can open the pages, at http://127.0.0.1:3000.
const host = "127.0.0.1";
const port = 3000;

// Names and emails are typed by a person. This stops them from being
// read as page code. The database rules are unchanged.
function escapeText(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

// Read one page file, such as list.html, as text.
function readPage(name) {
  const pagePath = join(directory, name);
  return readFileSync(pagePath, "utf8");
}

// The page files contain marks like {{name}}. This swaps in the real text.
function fill(template, values) {
  let text = template;
  const keys = Object.keys(values);
  for (const key of keys) {
    text = text.replaceAll(`{{${key}}}`, values[key]);
  }
  return text;
}

// Send a finished page back to the browser.
function sendHtml(response, status, html) {
  response.writeHead(status, {
    "Content-Type": "text/html; charset=utf-8",
  });
  response.end(html);
}

// Send the stylesheet. It is not a page.
function sendFile(response, name, type) {
  const body = readPage(name);
  response.writeHead(200, { "Content-Type": type });
  response.end(body);
}

// After a save or a delete, send the browser to another page.
function redirect(response, location) {
  response.writeHead(303, { Location: location });
  response.end();
}

// A person id is a whole number starting at 1. Anything else is rejected.
function readId(value) {
  if (typeof value !== "string") {
    return null;
  }
  if (!/^[1-9][0-9]*$/.test(value)) {
    return null;
  }
  return Number(value);
}

// A Save or Delete form arrives as one block of text. This reads it.
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

// Only these two finished actions get a message in the middle of the page.
// Any other word is ignored, so a person cannot invent a message.
function noticeHtml(notice) {
  if (notice === "saved") {
    return '<p class="toast">Saved</p>';
  }
  if (notice === "deleted") {
    return '<p class="toast">Person deleted</p>';
  }
  return "";
}

// The first page. listUsers reads the same database as the terminal.
function listPage(error, notice) {
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
    notice: noticeHtml(notice),
  });
  return html;
}

// The page for one person: Back and Edit. findUserById does the lookup.
function optionsPage(id, notice) {
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
    notice: noticeHtml(notice),
  });
}

// The edit form. The words in the boxes are the ones just typed,
// so a failed save still shows what the person tried to enter.
function editPage(person, error) {
  return fill(readPage("edit.html"), {
    id: escapeText(person.id),
    name: escapeText(person.name),
    email: escapeText(person.email),
    error: escapeText(error),
  });
}

// Each visit from the browser lands here. The path is the part after
// http://127.0.0.1:3000.
async function handle(request, response) {
  const url = new URL(request.url, `http://${host}`);
  const path = url.pathname;

  // The look of the pages.
  if (request.method === "GET" && path === "/styles.css") {
    sendFile(response, "styles.css", "text/css; charset=utf-8");
    return;
  }
  // The list. notice=deleted shows "Person deleted".
  if (request.method === "GET" && path === "/") {
    const notice = url.searchParams.get("notice");
    sendHtml(response, 200, listPage("", notice));
    return;
  }
  // One person, chosen by clicking a row.
  if (request.method === "GET" && path === "/user") {
    const id = readId(url.searchParams.get("id"));
    if (id === null) {
      sendHtml(response, 400, listPage("Invalid id"));
      return;
    }
    const notice = url.searchParams.get("notice");
    sendHtml(response, 200, optionsPage(id, notice));
    return;
  }
  // The form. An unknown person goes back to the list with the error.
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
  // Save. updateUser throws if the name or email is not allowed.
  // A good save goes to that person's page and shows "Saved".
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
      redirect(response, `/user?id=${id}&notice=saved`);
    } catch (caught) {
      sendHtml(response, 400, editPage({ id, name, email }, caught.message));
    }
    return;
  }
  // Delete is only reached from the confirm window.
  // Cancel never gets here. A good delete returns to the list.
  if (request.method === "POST" && path === "/user/delete") {
    const body = await readBody(request);
    const id = readId(body.get("id"));
    if (id === null) {
      sendHtml(response, 400, listPage("Invalid id"));
      return;
    }
    try {
      deleteUser(id);
      redirect(response, "/?notice=deleted");
    } catch (caught) {
      sendHtml(response, 400, listPage(caught.message));
    }
    return;
  }

  sendHtml(response, 404, listPage("That page is not here."));
}

// If a page fails in an unexpected way, say so instead of crashing quietly.
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
