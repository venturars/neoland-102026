import { defineConfig, globalIgnores } from "eslint/config";
import { parseSync } from "@babel/core";

const nestParser = {
  parseForESLint(code) {
    const file = parseSync(code, {
      babelrc: false,
      configFile: false,
      filename: "nest.js",
      parserOpts: {
        plugins: [["decorators", { version: "legacy" }], "estree"],
        ranges: true,
        sourceType: "module",
        tokens: true,
      },
    });
    const ast = file.program;
    ast.comments = [];
    ast.tokens = [];
    return { ast };
  },
};

export default defineConfig([
  globalIgnores([".venv/**", "src/clients/nest-run/**"]),
  {
    files: ["**/*.js"],
    rules: {
      "prefer-const": "warn",
      "no-constant-binary-expression": "error",
    },
  },
  {
    files: ["src/clients/nest/**/*.js"],
    languageOptions: {
      parser: nestParser,
    },
  },
]);
