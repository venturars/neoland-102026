import { existsSync } from "node:fs";
import { mkdtemp, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { delimiter, join } from "node:path";
import { URL, fileURLToPath } from "node:url";
import { spawn } from "node:child_process";
import { once } from "node:events";

const chromeOverride = process.env.CHROME_BIN;
const candidates = [];
if (chromeOverride) {
  candidates.push(chromeOverride);
} else if (process.platform === "darwin") {
  candidates.push(
    "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
  );
} else if (process.platform === "win32") {
  for (const directory of [
    process.env.PROGRAMFILES,
    process.env["PROGRAMFILES(X86)"],
    process.env.LOCALAPPDATA,
  ]) {
    if (directory)
      candidates.push(join(directory, "Google/Chrome/Application/chrome.exe"));
  }
} else {
  const directories = (process.env.PATH ?? "").split(delimiter);
  for (const directory of directories) {
    for (const command of ["google-chrome", "chromium", "chromium-browser"]) {
      candidates.push(join(directory, command));
    }
  }
}
const browser = candidates.find((candidate) => existsSync(candidate));
if (!browser) {
  console.error(
    "No encuentro Chrome/Chromium. Indica su ejecutable con CHROME_BIN.",
  );
  process.exit(1);
}

const page = new URL("../src/clients/web/index.html", import.meta.url);
const pagePath = fileURLToPath(page);
if (!existsSync(pagePath)) {
  console.error("No encuentro src/clients/web/index.html.");
  process.exit(1);
}
const profile = await mkdtemp(join(tmpdir(), "first-app-web-"));
const child = spawn(
  browser,
  [
    `--user-data-dir=${profile}`,
    "--allow-file-access-from-files",
    "--no-first-run",
    "--no-default-browser-check",
    page.href,
  ],
  { stdio: "ignore" },
);
function stop() {
  child.kill("SIGTERM");
}
process.on("SIGINT", stop);
process.on("SIGTERM", stop);
try {
  console.log(`Abriendo ${page.href}`);
  console.log(
    "Pulsa Ctrl+C para cerrar el cliente y eliminar su perfil temporal.",
  );
  const [code, signal] = await once(child, "exit");
  if (code !== 0 && signal !== "SIGTERM" && signal !== "SIGINT") {
    throw new Error("Chrome/Chromium terminó con un error.");
  }
} catch (error) {
  console.error(`No se pudo abrir el cliente: ${error.message}`);
  process.exitCode = 1;
} finally {
  process.removeListener("SIGINT", stop);
  process.removeListener("SIGTERM", stop);
  await rm(profile, { recursive: true, force: true, maxRetries: 3 });
}
