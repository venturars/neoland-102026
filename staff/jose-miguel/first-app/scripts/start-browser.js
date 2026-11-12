import { spawn } from "node:child_process";
import { existsSync, mkdirSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const scriptFile = fileURLToPath(import.meta.url);
const appRoot = join(dirname(scriptFile), "..");
const indexPath = join(appRoot, "src", "clients", "browser", "index.html");
const fileUrl = pathToFileURL(indexPath).href;

function isWindowsPlatform() {
  return process.platform === "win32";
}

function browserCandidates() {
  if (isWindowsPlatform()) {
    const programFiles = process.env.ProgramFiles || "";
    const programFilesX86 = process.env["ProgramFiles(x86)"] || "";
    return [
      join(programFiles, "Microsoft", "Edge", "Application", "msedge.exe"),
      join(programFilesX86, "Microsoft", "Edge", "Application", "msedge.exe"),
      join(programFiles, "Google", "Chrome", "Application", "chrome.exe"),
      join(programFilesX86, "Google", "Chrome", "Application", "chrome.exe"),
    ];
  }

  return [
    "/Applications/Brave Browser.app/Contents/MacOS/Brave Browser",
    "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
    "/Applications/Microsoft Edge.app/Contents/MacOS/Microsoft Edge",
  ];
}

function findBrowserExecutable() {
  const candidates = browserCandidates();
  for (const candidate of candidates) {
    if (existsSync(candidate)) {
      return candidate;
    }
  }
  return null;
}

function profileDirectory() {
  return join(tmpdir(), "first-app-browser-profile");
}

function main() {
  const profileDir = profileDirectory();
  if (!existsSync(profileDir)) {
    mkdirSync(profileDir, { recursive: true });
  }

  const browserPath = findBrowserExecutable();
  if (!browserPath) {
    console.error("No supported browser found.");
    console.error("Open this URL manually (with pnpm server running):");
    console.error(fileUrl);
    process.exit(1);
  }

  const args = [
    `--user-data-dir=${profileDir}`,
    "--allow-file-access-from-files",
    fileUrl,
  ];

  spawn(browserPath, args, {
    detached: true,
    stdio: "ignore",
  }).unref();

  console.log("Browser client:", fileUrl);
  console.log("Ensure the SQL server is running: pnpm server");
}

main();
