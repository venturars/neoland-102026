#!/usr/bin/env node
import { execFile } from "node:child_process";
import { randomUUID } from "node:crypto";
import { readFile, writeFile, open, unlink, rename } from "node:fs/promises";
import { resolve, join } from "node:path";
import { pathToFileURL } from "node:url";
import { promisify } from "node:util";
import { setTimeout as delay } from "node:timers/promises";

const exec = promisify(execFile);
const TTL = 48 * 60 * 60 * 1000;
const LOGIN = /^[a-z\d](?:[a-z\d-]{0,37}[a-z\d])?$/i;
const REPOSITORY = /^[\w.-]+\/[\w.-]+$/;

function isLogin(value) {
  return typeof value === "string" && LOGIN.test(value);
}

function normalizeName(value) {
  const name = value?.trim().normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().replace(/\s+/g, " ");
  if (!name) throw new Error("El nombre no puede estar vacío.");
  return name;
}

export function parseGhResponse(text) {
  const normalized = text.replace(/\r\n/g, "\n");
  const boundary = normalized.indexOf("\n\n");
  const status = Number(normalized.match(/^HTTP\/[\d.]+ (\d{3})/)?.[1]);
  if (!status || boundary < 0) throw new Error("Respuesta HTTP de gh inválida.");
  const headers = {};
  for (const line of normalized.slice(0, boundary).split("\n").slice(1)) {
    const colon = line.indexOf(":");
    if (colon > 0) headers[line.slice(0, colon).toLowerCase()] = line.slice(colon + 1).trim();
  }
  const body = normalized.slice(boundary + 2).trim();
  return { status, headers, body: body ? JSON.parse(body) : null };
}

async function requestGithub(host, endpoint, etag) {
  const args = ["api", endpoint, "--hostname", host, "--include", "--method", "GET", "--header", "Accept: application/vnd.github+json"];
  if (etag) args.push("--header", `If-None-Match: ${etag}`);
  try {
    const { stdout } = await exec("gh", args, { timeout: 30000, maxBuffer: 8 * 1024 * 1024 });
    return parseGhResponse(stdout);
  } catch (error) {
    if (error.stdout) {
      const response = parseGhResponse(error.stdout);
      if (response.status === 304) return response;
      throw new Error(`GitHub respondió HTTP ${response.status}.`);
    }
    throw new Error("No se pudo consultar GitHub con gh.");
  }
}

function projectBody(endpoint, body) {
  // Solo se persisten los campos de identidad necesarios, nunca correos o permisos.
  if (endpoint.startsWith("users/")) {
    if (!body || !isLogin(body.login) || (body.name !== null && typeof body.name !== "string")) throw new Error("Perfil de GitHub inválido.");
    return { login: body.login, name: body.name };
  }
  if (!Array.isArray(body) || body.some((item) => !isLogin(item?.login))) throw new Error("Directorio de GitHub inválido.");
  return body.map(({ login }) => ({ login }));
}

function validCache(cache, now) {
  if (cache?.version !== 1 || !Number.isFinite(cache.cycleStartedAt) || cache.cycleStartedAt > now || now - cache.cycleStartedAt >= TTL) return false;
  if (!cache.contexts || typeof cache.contexts !== "object" || Array.isArray(cache.contexts)) return false;
  try {
    for (const context of Object.values(cache.contexts)) {
      if (!context || !context.aliases || !context.responses || typeof context.aliases !== "object" || typeof context.responses !== "object" || Array.isArray(context.aliases) || Array.isArray(context.responses)) return false;
      for (const [alias, login] of Object.entries(context.aliases)) {
        if (normalizeName(alias) !== alias || typeof login !== "string" || !LOGIN.test(login)) return false;
      }
      for (const [endpoint, response] of Object.entries(context.responses)) {
        if (!/^(users\/[a-z\d-]+|repos\/[\w.-]+\/[\w.-]+\/collaborators\?per_page=100&page=\d+)$/i.test(endpoint)) return false;
        if (!response || typeof response.next !== "boolean" || (response.etag !== null && (typeof response.etag !== "string" || /[\r\n]/.test(response.etag)))) return false;
        projectBody(endpoint, response.body);
      }
    }
    return true;
  } catch {
    return false;
  }
}

async function acquireLock(path) {
  const deadline = Date.now() + 2000;
  while (Date.now() < deadline) {
    try {
      const handle = await open(path, "wx", 0o600);
      try { await handle.writeFile(String(process.pid)); } catch {
        await handle.close();
        await unlink(path).catch(() => {});
        return null;
      }
      return handle;
    } catch (error) {
      if (error.code !== "EEXIST") return null;
      // No se fuerza el borrado de un bloqueo ajeno: al vencer la espera se usa GitHub sin persistir.
      await delay(40);
    }
  }
  return null;
}

async function saveCache(path, cache) {
  const temporary = `${path}.${randomUUID()}.tmp`;
  try {
    await writeFile(temporary, `${JSON.stringify(cache, null, 2)}\n`, { encoding: "utf8", flag: "wx", mode: 0o600 });
    await rename(temporary, path);
  } finally {
    await unlink(temporary).catch(() => {});
  }
}

export async function runCache(args, { root, host, account, request, now = Date.now, warn = console.error }) {
  const [command, ...input] = args;
  const operation = command === "alias" ? input.shift() : command;
  const repository = input.shift()?.toLowerCase();
  if (!REPOSITORY.test(repository ?? "") || !isLogin(account) || typeof host !== "string" || !/^[a-z\d.-]+$/i.test(host)) throw new Error("Indica servidor, cuenta y OWNER/REPO válidos.");
  const refresh = input.at(-1) === "--refresh";
  if (refresh) input.pop();
  const valid = command === "alias"
    ? !refresh && ((operation === "get" && input.length > 0) || (operation === "remove" && input.length === 1) || (operation === "set" && (input.length === 2 || (input.length === 3 && input[2] === "--replace")) && isLogin(input[1])))
    : (command === "directory" && input.length === 0) || (command === "profile" && input.length === 1 && isLogin(input[0]));
  if (!valid) throw new Error("Uso: alias get|set|remove OWNER/REPO NOMBRE... | directory OWNER/REPO [--refresh] | profile OWNER/REPO LOGIN [--refresh]");
  if (command === "alias") input[0] = normalizeName(input[0]);

  const path = join(root, ".git-workflow-cache.json");
  const lockPath = join(root, ".git-workflow-cache.lock");
  const lock = await acquireLock(lockPath);
  let available = Boolean(lock);
  const blank = () => ({ version: 1, cycleStartedAt: now(), contexts: {} });
  let cache = blank();
  let dirty = false;
  if (available) {
    try {
      const stored = JSON.parse(await readFile(path, "utf8"));
      if (validCache(stored, now())) cache = stored;
      else dirty = true;
    } catch { dirty = true; }
  } else warn("Caché no disponible; se continúa sin persistencia.");

  try {
    const key = JSON.stringify([host.toLowerCase(), account.toLowerCase(), repository]);
    const context = cache.contexts[key] ?? { aliases: {}, responses: {} };
    cache.contexts[key] = context;

    async function responseFor(endpoint) {
      const stored = context.responses[endpoint];
      if (stored && !refresh) return stored;
      const response = await request(endpoint, stored?.etag);
      let projected;
      if (response.status === 304 && stored) {
        projected = { ...stored, next: response.headers.link ? /rel="next"/.test(response.headers.link) : stored.next };
      } else if (response.status === 200) {
        projected = { body: projectBody(endpoint, response.body), etag: response.headers.etag ?? null, next: /rel="next"/.test(response.headers.link ?? "") };
      } else throw new Error(`GitHub respondió HTTP ${response.status}; no se reutiliza una respuesta anterior.`);
      context.responses[endpoint] = projected;
      dirty = true;
      return projected;
    }

    let result;
    if (command === "alias" && operation === "get") {
      result = { reviewers: input.map((name) => {
        const alias = normalizeName(name);
        return { name, alias, login: Object.hasOwn(context.aliases, alias) ? context.aliases[alias] : null };
      }) };
    } else if (command === "alias" && operation === "set") {
      const [alias, login] = input;
      if (Object.hasOwn(context.aliases, alias) && context.aliases[alias].toLowerCase() !== login.toLowerCase() && input[2] !== "--replace") throw new Error("Usa --replace para corregir una asociación existente.");
      context.aliases = { ...context.aliases, [alias]: login };
      dirty = true;
      result = { alias, login };
    } else if (command === "alias" && operation === "remove") {
      const removed = Object.hasOwn(context.aliases, input[0]);
      delete context.aliases[input[0]];
      dirty = true;
      result = { alias: input[0], removed };
    } else if (command === "profile") {
      result = await responseFor(`users/${input[0].toLowerCase()}`);
      result = { profile: result.body };
    } else {
      const collaborators = [];
      let page = 1;
      let response;
      do {
        response = await responseFor(`repos/${repository}/collaborators?per_page=100&page=${page++}`);
        collaborators.push(...response.body);
      } while (response.next);
      result = { collaborators };
    }

    if (available && dirty) {
      try { await saveCache(path, cache); } catch {
        available = false;
        warn("No se pudo guardar la caché; el resultado sigue disponible sin persistencia.");
      }
    }
    return { repository, ...result, cacheAvailable: available };
  } finally {
    if (lock) {
      await lock.close();
      await unlink(lockPath).catch(() => {});
    }
  }
}

async function main() {
  const host = process.env.GH_HOST || "github.com";
  const { stdout } = await exec("git", ["rev-parse", "--show-toplevel"]);
  const identity = await requestGithub(host, "user");
  if (identity.status !== 200 || !isLogin(identity.body?.login)) throw new Error("No se pudo confirmar la cuenta de GitHub.");
  const result = await runCache(process.argv.slice(2), {
    root: stdout.trim(), host, account: identity.body.login,
    request: (endpoint, etag) => requestGithub(host, endpoint, etag),
  });
  console.log(JSON.stringify(result));
}

if (process.argv[1] && pathToFileURL(resolve(process.argv[1])).href === import.meta.url) {
  main().catch((error) => { console.error(error.message); process.exitCode = 1; });
}
