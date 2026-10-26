# AGENTS.md — first-app

## Proyecto

first-app es la primera app del curso de IA Engineer para alumnos junior. Sirve para construirla con IA siguiendo el sistema SDD.

Está en Node, con módulos ESM (`"type": "module"`) y SQLite (`node:sqlite`, fichero `db/users.sqlite`) y pnpm como gestor de paquetes. Las reglas de base están en `docs/CONSTITUTIONS.md`. Esa guía enlaza a la arquitectura, el árbol, la base de datos, los errores y el estilo.

## Orden

Un cambio del proyecto es un desarrollo. Lo es una funcionalidad, una dependencia, la configuración y la documentación.

El primer proceso crea `docs/specs/<nombre>/`. `<nombre>` va en kebab-case. Escribe `spec.md` y `plan.md`. Si la constitución, el código actual y la spec dicen lo mismo, escribe también `tasks.md`. Si no dicen lo mismo, la pregunta queda al final del plan y no hay `tasks.md`. En ese proceso no se toca ningún otro fichero. Ahí se para.

Una persona lee lo escrito. El proceso de implementación empieza cuando esa persona lo pide. Ejecuta `tasks.md` y no inventa pasos.

El camino issue, rama y pull request del bootcamp está en `docs/GIT-WORKFLOW.md`, en la raíz del repositorio. Dentro de first-app, cualquier funcionalidad nueva sigue SDD (spec antes que código), aunque ya exista issue en GitHub.

## Reglas

- Un cambio del proyecto empieza por `docs/specs/<nombre>/`. El primer proceso crea `spec.md` y `plan.md`. Si no hay contradicción, crea también `tasks.md`. No toca ningún otro fichero. Ahí se para.
- El proceso de implementación empieza cuando una persona ha leído esos ficheros y lo pide. Ese proceso solo ejecuta `tasks.md`.
- Lee `docs/CONSTITUTIONS.md` y la spec activa antes de tocar código. Si no hay spec para ese cambio, se crea (proceso de spec) y se para.
- No inventar ficheros, capas, campos ni enlaces.
- Añadir código, dependencias, scripts, tests, SQL o clientes solo cuando el usuario lo pida en esa tarea.
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

   - **`depscore`**: `ecosystem` `npm`, `depname`, `version`. Anotar las stats
     que devuelve Socket. Marcar **stat < 50** cuando cualquier puntuación
     numérica de la respuesta sea menor que 50.
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
   paquete revisado, con columnas: capa, paquete@versión, campaña (sí/no),
   alertas (sí/no; detalle en conversación), stats < 50 (listar cuáles o
   «ninguna»). Si no hubo incidencias, decirlo explícitamente.

Queda fuera comprobar paquetes que no son de Node, comprobar un paquete cuya
versión no cambia en el plan, mirar más de 3 capas, decidir alertas sin la
persona y usar herramientas distintas del MCP Socket para sustituir esta
validación.

## Comandos

- Ejecutar: no hay comando.
- Tests: no hay. El script `test` de `package.json` termina en error. No se añaden tests ni se cambia ese script.
- Lint/formato: Prettier por defecto. No hay `.prettierrc` ni script de formato.

## Estilo y convenciones

La forma de cada línea y las convenciones están en `docs/STYLE.md`.

## Al terminar una tarea

- Al crear una funcionalidad se crea su primer cliente en `clients/terminal/`, un `.txt` que se pega en la terminal con el directorio actual en `first-app`. Ese cliente importa la función de `logic/` y hace `console.log` del resultado. Es el test manual básico.
- Comprueba que el desarrollo nuevo funciona antes de dar la tarea por terminada. La comprobación es ejecutar ese fragmento de `clients/terminal/`.
