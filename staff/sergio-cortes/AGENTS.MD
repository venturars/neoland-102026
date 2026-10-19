# AGENTS.md — AI-USER-DB

## Proyecto

CRUD de usuarios en Node.js (≥ 22, ES modules) con SQLite vía `node:sqlite`. Capas: `db/` (conexión), `queries/` (SQL), `logic/` (casos de uso, validación, errores, DTO), `clients/terminal/` (scripts ejecutables manuales).

Flujo SDD: la única fuente normativa del repo es [docs/constitution.md](docs/constitution.md). No hay archivos de spec separados. Léela antes de tocar código.

## Comandos

- Ejecutar (desde la raíz del proyecto): ver [clients/terminal/comandos.txt](clients/terminal/comandos.txt), p. ej. `node clients/terminal/create-table/create-table.js`, `node clients/terminal/create-user/create-user.js`, etc.
- Tests: no hay suite; no añadir tests salvo petición explícita.
- Lint/formato: Prettier — `npx prettier --write .` (o `--write` sobre los archivos tocados). No hay `.prettierrc` en el repo aún; usar defaults de Prettier.

## Estilo y convenciones

- `"type": "module"`, importaciones con rutas relativas y extensión `.js`.
- Nombres de funciones **intuitivos y buscables** (camelCase, verbos claros).
- Una función, una responsabilidad; no mezclar SQL, reglas de negocio y salida de terminal en el mismo sitio si rompe las capas de [constitution.md](docs/constitution.md).
- **Módulos y errores:** seguir [constitution.md](docs/constitution.md) (capas, un export por archivo, dominio vs técnico, helper único de error en clientes).
- Mensajes de error y strings de dominio en **inglés** (como el código actual).
- Disciplina de implementación: seguir el plan acordado paso a paso; temperatura baja — no improvisar features, carpetas ni reglas no documentadas.

## Reglas

- Leer [docs/constitution.md](docs/constitution.md) antes de implementar o cambiar comportamiento.
- **No inventar** requisitos, capas, endpoints ni reglas que no estén en constitution o en instrucciones explícitas del usuario.
- **Ubicación de código**: si hay duda sobre en qué capa o archivo debe vivir una función, **preguntar y acordar el paso antes de editar**.
- Respetar límites de capa (conexión → queries → logic → clients).
- Diff mínimo; no refactorizar archivos ajenos a la tarea.
- Actualizar [constitution.md](docs/constitution.md) si cambian **patrones** transversales, el **árbol del proyecto**, o la **base de datos** (sección Database).
- No hacer commits salvo petición explícita.

## Al terminar cualquier tarea

- Formatear con Prettier los archivos modificados.
- Si el cambio afecta comportamiento, verificar con el script `node` correspondiente en `clients/terminal/`.
- Si tocaste patrones, la base de datos, o el árbol, comprobar que [constitution.md](docs/constitution.md) sigue alineada.
