import { execSync } from "node:child_process";
import { rmSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const fileUrl = import.meta.url;
const filePath = fileURLToPath(fileUrl);
const scriptsDir = dirname(filePath);
const rootDir = join(scriptsDir, "..");
const distDir = join(rootDir, "dist");

rmSync(distDir, { recursive: true, force: true });

const babelCommand =
  "pnpm exec babel src -d dist --config-file ./babel.config.json";
execSync(babelCommand, { cwd: rootDir, stdio: "inherit" });

const nodeCommand = "node dist/clients/nest/main.js";
execSync(nodeCommand, { cwd: rootDir, stdio: "inherit" });
