import { execFileSync } from "node:child_process";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const fileUrl = import.meta.url;
const filePath = fileURLToPath(fileUrl);
const scriptsDir = dirname(filePath);
const rootDir = join(scriptsDir, "..");
const collectionDir = join(rootDir, "src", "clients", "http", "bruno");
const bruBin = join(
  rootDir,
  "node_modules",
  "@usebruno",
  "cli",
  "bin",
  "bru.js",
);

execFileSync(process.execPath, [bruBin, "run", "01-sql-online", "-r"], {
  cwd: collectionDir,
  stdio: "inherit",
});
