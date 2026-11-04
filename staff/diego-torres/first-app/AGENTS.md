# AGENTS.md — first-app

El trabajo de git sigue `agents/git-workflow-agent.md` de esta carpeta. Las paradas son las de «Orden». Ese flujo no las quita.

## Proyecto

first-app es una app de usuarios para alumnos junior. Se construye con IA siguiendo el sistema SDD.

Está en Node, con módulos ES (`"type": "module"`). SQLite entra con `node:sqlite`. Las dependencias de paquete son `openai`, `cli-table3`, `@colors/colors` y `fastify`. Las de desarrollo son `prettier`, `eslint`, `@eslint/js` y `electron`. Los scripts se lanzan con pnpm.

La arquitectura está en `docs/CONSTITUCION.md` y en las guías que enlaza (`docs/ARCHITECTURE.md`, `docs/DATABASE.md`, `docs/ERRORS.md`, `docs/STYLE.md` y `docs/TREE.md`). Esta guía no las repite. Si una tarea y la constitución chocan, gana la constitución. Si la constitución, el código y esta guía se contradicen, se pregunta antes de escribir.

Un desarrollo nuevo pasa por `docs/specs/<nombre>/`, con `<nombre>` en kebab-case. Ahí viven `spec.md`, `plan.md` y `tasks.md`.

El directorio de trabajo es `staff/diego-torres/first-app`.

## Orden

Lo primero es el orquestador (`agents/git-workflow-agent.md`). Elige un momento y llama a ese subagente como un agente aparte. El padre no entrevista, no crea la issue y no ejecuta el git ni el MCP de ese momento.

No se crea `docs/specs/<nombre>/` antes de que exista el número de issue. Con la issue escrita, el proceso siguiente escribe `spec.md` y `plan.md`. La spec abre con `Issue: #N`. No toca ningún otro fichero. Ahí se para. Una persona revisa la spec y el plan.

Si la constitución, el código actual y la spec no dicen lo mismo, la pregunta queda al final del plan y no hay `tasks.md`. Si dicen lo mismo y la persona ha revisado, el siguiente proceso escribe `tasks.md`. Ahí se para. No se implementa.

La implementación empieza cuando esa persona lo pide. Ejecuta `tasks.md` y no inventa pasos.

## Código

El código vive en `src/`: `src/db/`, `src/queries/`, `src/logic/` y `src/clients/`. Qué sabe cada carpeta está en `docs/ARCHITECTURE.md`. La base y el servidor SQL están en `docs/DATABASE.md`.

Ningún cliente funciona sin el servidor en marcha. Antes de usar la web, Electron, la extensión de Chrome, la terminal o Jupyter, se lanza `pnpm start` en otra terminal.

## Paquetes

Al añadir un paquete de Node o cambiar su versión, se comprueba con Socket antes de aceptar el plan. La referencia del MCP está en `MCPS/socket-mcp/mcp.txt`.

Entra el paquete y la versión. También entran las dependencias de ese paquete, hasta 3 capas.

El resumen entra en el plan antes de aceptarlo. Para el paquete y para cada dependencia, el resumen dice si esa versión está en una campaña, si tiene una alerta y si alguna stat está por debajo de 50 puntos. Cada dato dice de dónde sale. Si una fuente no puede contestar, el resumen dice el motivo.

Las alertas se comentan. Quien acepta el plan decide si las acepta.

Queda fuera comprobar paquetes que no son de Node, comprobar un paquete cuya versión no cambia, mirar más de 3 capas y decidir las alertas por la persona.

### Token de Socket

`.mcp.json` lee el token de la variable de entorno `SOCKET_API_TOKEN`. El token no se escribe en ningún fichero del repo. `.mcp.json` está ignorado por git; `.mcp.example.json` es la plantilla sin secretos.

Para empezar, copia `.mcp.example.json` a `.mcp.json` y define `SOCKET_API_TOKEN` en tu entorno. La documentación oficial de Socket describe OAuth (el navegador pide la autenticación la primera vez); la cabecera con token no está en esa documentación y hay que probarla con tu token.

## Comandos

Desde esta carpeta, Jupyter se abre con `pnpm run jupyter`, en Linux y en Windows. Lo lanza `scripts/jupyter.js`: la primera vez crea `.venv` e instala `notebook==7.6.3`; las siguientes lo reutiliza.

`pnpm start` lanza `src/db/server.js`, el servidor de datos en `http://127.0.0.1:3000`. Tiene que estar en marcha para cualquier cliente.

`pnpm browser` abre `src/clients/web/index.html` como fichero en Google Chrome, con un perfil aparte y `--allow-file-access-from-files`. Se lanza en otra terminal, con `pnpm start` ya en marcha.

`pnpm electron` abre `src/clients/electron/` en una ventana de escritorio propia. Se lanza en otra terminal, con `pnpm start` ya en marcha.

`pnpm chrome` lanza `src/clients/chrome/server.js`, la API de la extensión en `http://127.0.0.1:3002`. Se lanza en otra terminal, con `pnpm start` ya en marcha. La extensión se carga a mano: en `chrome://extensions`, se activa el modo de desarrollador, se pulsa «Cargar extensión sin empaquetar» y se elige `src/clients/chrome/`.

`pnpm format` pasa Prettier por los `.js` de `src/db/`, `src/queries/` y `src/logic/`, y por los `.js`, `.html` y `.css` de `src/clients/web/`, `src/clients/electron/` y `src/clients/chrome/`, con el formato estándar y sin configuración propia. `pnpm lint` pasa ESLint con las reglas recomendadas, según `eslint.config.js`.

La dependencia `openai` es la del clasificador. `@colors/colors` y `cli-table3` son las tablas del cliente Jupyter. `fastify` es la API de la extensión de Chrome. Se instalan con `pnpm install`.

## Estilo

Está en `docs/STYLE.md`.

## Antes de escribir

- Lee `docs/CONSTITUCION.md` y sus guías.
- No inventes campos, errores, carpetas ni operaciones.
- Si la constitución, el código y esta guía se contradicen, pregunta antes de escribir.
