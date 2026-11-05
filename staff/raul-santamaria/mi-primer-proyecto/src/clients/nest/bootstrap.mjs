import { copyFileSync, mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { transformFile } from "@swc/core";

const nestDir = dirname(fileURLToPath(import.meta.url));
const runDir = join(nestDir, ".run");
mkdirSync(runDir, { recursive: true });
const files = [
  "logic-error.constants.js",
  "logic-exception.filter.js",
  "users.service.js",
  "users.controller.js",
  "app.module.js",
  "main.js",
];

for (const file of files) {
  const sourcePath = join(nestDir, file);
  const targetPath = join(runDir, file);
  if (file === "logic-error.constants.js") {
    copyFileSync(sourcePath, targetPath);
    continue;
  }
  const result = await transformFile(sourcePath, {
    jsc: {
      parser: {
        syntax: "ecmascript",
        decorators: true,
      },
      transform: {
        legacyDecorator: true,
        decoratorMetadata: true,
      },
      target: "es2022",
    },
    module: {
      type: "es6",
    },
  });
  let code = result.code;
  code = code.replaceAll("../../logic/", "../../../logic/");
  writeFileSync(targetPath, code);
}

await import(pathToFileURL(join(runDir, "main.js")).href);
