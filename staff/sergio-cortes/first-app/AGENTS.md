# AGENTS.md — first-app

El trabajo de git sigue `agents/git-workflow-agent.md` de esta carpeta. Las paradas son las de «Orden». Ese flujo no las quita.

## Proyecto

first-app es la primera app del curso de IA Engineer para alumnos junior. Sirve para construirla con IA siguiendo el sistema SDD.

Las reglas de base están en `docs/CONSTITUTIONS.md`. Esa guía enlaza a la arquitectura, el árbol, la base de datos, los errores y el estilo.

## Orden

Lo primero es el orquestador. Elige un momento y llama a ese subagente como un agente aparte. El padre no entrevista, no crea la issue y no ejecuta el git ni el MCP de ese momento.

No se crea `docs/specs/<nombre>/` antes de que exista el número de issue. `<nombre>` va en kebab-case.

Con la issue escrita, el proceso siguiente escribe `spec.md` y `plan.md`. La spec abre con `Issue: #N`. No toca ningún otro fichero. Ahí se para. Una persona revisa la spec y el plan.

Si la constitución, el código actual y la spec no dicen lo mismo, la pregunta queda al final del plan y no hay `tasks.md`.

Si dicen lo mismo y la persona ha revisado, el siguiente proceso escribe `tasks.md`. Ahí se para. No se implementa.

La implementación empieza cuando esa persona lo pide. Ejecuta `tasks.md` y no inventa pasos.

## Reglas

- Un cambio del proyecto empieza por el orquestador y sigue «Orden».
- El proceso de implementación empieza cuando una persona ha leído esos ficheros y lo pide. Ese proceso solo ejecuta `tasks.md`.
- Lee `docs/CONSTITUTIONS.md` y la spec activa antes de tocar código. Si no hay spec para ese cambio, se crea (proceso de spec) y se para.
- No inventar ficheros, capas, campos ni enlaces.
- Añadir código, dependencias, scripts, tests, SQL o clientes solo en la **fase Implementación**, con spec y plan **aprobados** por la persona. Pedir la funcionalidad en la issue o en el chat no sustituye esa aprobación.
- Temperatura próxima a 0. No inventes: cíñete al plan y a la spec activa.
- Usar pnpm como gestor de paquetes.
- En cada tarea: investiga antes de escribir y compara si la tarea tiene parentesco con otra ya resuelta. El código que ya existe sirve para ver a qué fichero se parece una función nueva. La forma de cada línea se copia de `docs/STYLE.md`. Un spec nuevo no se para porque el código ya escrito no tenga esa forma.
- Si un desarrollo añade o quita un fichero, su plan también actualiza `docs/TREE.md` y `docs/ARCHITECTURE.md`.
- Si aparecen dos fuentes de verdad o dos procedimientos que se contradicen (la constitución, el código actual, una spec o esta guía), no se elige uno. En el plan se pregunta qué camino seguir y si hay que modificar la documentación antes de empezar la spec nueva. No se escribe código hasta tener esa respuesta.
- No propongas código que no se haya comprobado.

## Paquetes

### Cuándo

Antes de dar por aceptado un `plan.md` que añade un paquete de Node o cambia su
versión en `package.json`. También antes de ejecutar `tasks.md` que incluya ese
cambio si el plan aún no trae el resumen.

### Hasta aprobación del plan

La validación Socket la hace el agente al redactar el `plan.md` (fase Spec). Eso **no** autoriza instalar ni implementar.

El plan con `## Validación Socket` queda **pendiente de aceptación** hasta que la persona:

- aprueba el `spec.md` y el `plan.md`, y
- si hubo alertas abiertas relevantes, dice explícitamente si las acepta.

Mientras no haya esa aceptación:

- prohibido `pnpm add`, `pnpm install` y `pnpm update` por esos paquetes;
- prohibido editar `package.json` / `pnpm-lock.yaml` por ese desarrollo;
- prohibido ejecutar pasos de `tasks.md` que instalen o configuren esos paquetes.

Si el MCP Socket no permite completar la validación (por ejemplo `organizations` no autorizado tras `mcp_auth`), el plan **no** se presenta como listo para aprobar: se documenta el fallo en el plan y se espera (reintento MCP o decisión de la persona). No se sustituye Socket por un resumen inventado ni por una «muestra» parcial. Si la validación queda incompleta, la pregunta va al final del `plan.md` y no hay `tasks.md` hasta tener respuesta.

### Qué se revisa

Ecosistema `npm`. Entra el paquete principal con la versión exacta que propone
el plan. Entran sus dependencias hasta **3 capas**, cada una con versión
concreta resuelta (no rangos en el resumen).

Para obtener el árbol hasta 3 capas: partir del manifest publicado de la versión
(`pnpm view <paquete>@<versión> dependencies`, y repetir por cada dependencia
nueva hasta la tercera capa). Si un paquete ya salió en una capa anterior con
la misma versión, no se vuelve a consultar.

### MCP Socket

1. Si el MCP no responde o pide autenticación, usar `mcp_auth` y reintentar. Si
   sigue fallando, no se acepta el plan (spec: no inventar resumen).
2. Llamar a `organizations` y guardar `org_slug` para herramientas de org.
3. Por cada `depname@version` del árbol (capa 0 = directo, 1–3 = dependencias):

   - **`depscore`**: `ecosystem` `npm`, `depname`, `version`. Anotar **license**,
     **maintenance**, **quality**, **supplyChain** y **vulnerability** (0–100).
     Marcar **stat < 50** cuando cualquiera de esas puntuaciones sea menor que 50.
   - **`alerts`**: `org_slug`, `artifact_type` `npm`, `artifact_name` =
     `depname`, `status` `open`. Quedarse con las que correspondan a esa versión
     si la respuesta lo permite.
   - **`threat_feed`**: `org_slug`, `ecosystem` `npm`, `name`, `version`. Si
     hay coincidencia, cuenta como **campaña / threat feed** para el resumen.

4. **Alertas**: las abiertas relevantes se **comentan en la conversación**
   (paquete, versión, tipo o categoría, severidad si viene). No se acepta el
   plan ni se sigue con dependencias hasta que la persona diga si acepta esas
   alertas.

5. **Resumen en el plan**: añadir la sección `## Validación Socket` al
   `plan.md` del desarrollo **antes** de darlo por aceptado. Una fila por
   paquete revisado, con columnas: **capa**, **paquete@versión**, **campaña**
   (sí/no; si `threat_feed` no aplica en el plan de la org, indicarlo, p. ej.
   `n/d (plan free)`), **alertas** (sí/no; detalle en conversación),
   **license**, **maintenance**, **quality**, **supplyChain**, **vulnerability**
   (valores de `depscore`), **stats < 50** (listar cuáles o «ninguna»). Si no
   hubo incidencias, decirlo explícitamente en el texto de la sección.

Queda fuera comprobar paquetes que no son de Node, comprobar un paquete cuya
versión no cambia en el plan, mirar más de 3 capas, decidir alertas sin la
persona y usar herramientas distintas del MCP Socket para sustituir esta
validación.

## Comandos

- Ejecutar: no hay comando.
- Tests: no hay. El script `test` de `package.json` termina en error. No se añaden tests ni se cambia ese script.
- Formato: `pnpm run format` (Prettier por defecto, sin `.prettierrc`).
- Lint: `pnpm run lint` (ESLint con `eslint.config.js`).

## Al terminar una tarea

- Al crear una funcionalidad se crea su primer cliente en `clients/terminal/`, un `.txt` que se pega en la terminal con el directorio actual en `first-app`. Ese cliente importa la función de `logic/` y hace `console.log` del resultado. Es el test manual básico.
- Comprueba que el desarrollo nuevo funciona antes de dar la tarea por terminada. La comprobación es ejecutar ese fragmento de `clients/terminal/`.
- Ejecutar `pnpm run format` sobre el código tocado.
- Ejecutar `pnpm run lint` y corregir los errores antes de dar la tarea por terminada.
