#!/usr/bin/env node
import { readFileSync, writeFileSync, renameSync, unlinkSync } from "node:fs";
import { fileURLToPath } from "node:url";

const cachePath = fileURLToPath(new URL("../skills/assign-reviewers/reviewer-cache.json", import.meta.url));
const [action, repositoryInput, ...args] = process.argv.slice(2);
const CACHE_TTL_MS = 48 * 60 * 60 * 1000;

function normalizeName(value) {
  const name = value?.trim().normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().replace(/\s+/g, " ");
  if (!name) throw new Error("El nombre del revisor no puede estar vacío.");
  return name;
}

function readCache() {
  const cache = JSON.parse(readFileSync(cachePath, "utf8"));
  if (![1, 2].includes(cache.version) || !cache.repositories || typeof cache.repositories !== "object" || Array.isArray(cache.repositories)) {
    throw new Error("La caché tiene un formato incompatible.");
  }
  for (const [repository, entries] of Object.entries(cache.repositories)) {
    if (!/^[\w.-]+\/[\w.-]+$/.test(repository) || !entries || typeof entries !== "object" || Array.isArray(entries)) {
      throw new Error("La caché contiene un repositorio inválido.");
    }
    for (const [name, login] of Object.entries(entries)) {
      if (normalizeName(name) !== name || !/^[a-z\d](?:[a-z\d-]{0,37}[a-z\d])?$/i.test(login)) {
        throw new Error("La caché contiene una asociación inválida.");
      }
    }
  }

  const now = Date.now();
  if (cache.version === 1) {
    // Una caché anterior conserva sus alias y empieza ahora su primer ciclo de 48 horas.
    cache.version = 2;
    cache.cycleStartedAt = new Date(now).toISOString();
    return { cache, changed: true };
  }

  const startedAt = Date.parse(cache.cycleStartedAt);
  if (!Number.isFinite(startedAt) || new Date(startedAt).toISOString() !== cache.cycleStartedAt) {
    throw new Error("La fecha de la caché es inválida.");
  }
  if (now - startedAt >= CACHE_TTL_MS) {
    // Al primer uso tras el vencimiento se borran los alias y comienza otro ciclo.
    cache.repositories = {};
    cache.cycleStartedAt = new Date(now).toISOString();
    return { cache, changed: true };
  }
  return { cache, changed: false };
}

function saveCache(cache) {
  // El archivo temporal evita dejar una caché truncada si falla la escritura.
  const temporaryPath = `${cachePath}.${process.pid}.tmp`;
  try {
    writeFileSync(temporaryPath, `${JSON.stringify(cache, null, 2)}\n`, { encoding: "utf8", flag: "wx" });
    renameSync(temporaryPath, cachePath);
  } catch (error) {
    try { unlinkSync(temporaryPath); } catch { /* Puede no haberse creado. */ }
    throw error;
  }
}

try {
  const repository = repositoryInput?.toLowerCase();
  if (!/^[\w.-]+\/[\w.-]+$/.test(repository ?? "")) throw new Error("Indica OWNER/REPO.");
  const { cache, changed } = readCache();
  if (changed) saveCache(cache);
  const entries = cache.repositories[repository] ?? {};

  if (action === "get" && args.length > 0) {
    // Cada nombre devuelve su login guardado o null; una ausencia permite buscar solo ese nombre.
    const reviewers = args.map((name) => {
      const alias = normalizeName(name);
      return { name, alias, login: Object.hasOwn(entries, alias) ? entries[alias] : null };
    });
    console.log(JSON.stringify({ repository, reviewers }));
  } else if (action === "set" && (args.length === 2 || (args.length === 3 && args[2] === "--replace"))) {
    const [name, loginInput] = args;
    const alias = normalizeName(name);
    const login = loginInput.toLowerCase();
    if (!/^[a-z\d](?:[a-z\d-]{0,37}[a-z\d])?$/.test(login)) throw new Error("Login de GitHub inválido.");
    if (Object.hasOwn(entries, alias) && entries[alias] !== login && args[2] !== "--replace") throw new Error("Asociación distinta; usa --replace para corregirla.");
    cache.repositories[repository] = { ...entries, [alias]: login };
    saveCache(cache);
    console.log(JSON.stringify({ repository, alias, login }));
  } else if (action === "remove" && args.length === 1) {
    const alias = normalizeName(args[0]);
    if (!Object.hasOwn(entries, alias)) throw new Error("La asociación no existe.");
    delete entries[alias];
    saveCache(cache);
    console.log(JSON.stringify({ repository, alias, removed: true }));
  } else {
    throw new Error("Uso: reviewer-cache.js get OWNER/REPO NOMBRE... | set OWNER/REPO NOMBRE LOGIN [--replace] | remove OWNER/REPO NOMBRE");
  }
} catch (error) {
  console.error(error.message);
  process.exitCode = 1;
}
