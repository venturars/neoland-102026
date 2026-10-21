# Agent working instructions

Foundation approved by Miguel on 2026-10-20.

Read [the constitution](docs/CONSTITUTIONS.md) and any active feature's documents before changing code. The constitution defines application behavior, dependency rules, and the spec → plan → tasks review sequence; follow it rather than inventing parallel rules.

- Investigate the existing code and reuse its patterns when appropriate.
- Keep each request bounded. Do not start later steps automatically.
- Follow the constitution's review gates before implementing new SDD features.
- Use kebab-case filenames, camelCase functions, named exports, and `.js` import extensions. Keep explicitly prescribed document names such as `AGENTS.md` and `CONSTITUTIONS.md`.
- Prefer direct, readable code. Do not add generic helpers, wrappers, custom error classes, extra layers, or dependencies without an agreed need. Follow the constitution's dependency and package-management rules.
- Give each new business operation its own logic file and copyable terminal `.txt` client.
- Execute the terminal example before claiming the operation works.
- Verify executable changes in disposable project copies. Preserve working data, remove temporary files, and report the commands executed and actual results.
- If instructions, documents, and code conflict, explain the conflict and stop the affected work for a decision. Do not silently choose one version.
- Leave all Git and publishing actions to Miguel; do not run Git commands or publish.

Refer to the constitution for application rules. Feature-specific requirements belong in that feature's documents.
