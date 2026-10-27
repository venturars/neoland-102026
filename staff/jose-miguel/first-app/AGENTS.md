# AGENTS.md — first-app

## Proyecto

first-app es la primera app del curso de IA Engineer para alumnos junior. Sirve para construirla con IA siguiendo el sistema SDD.

Está en Node, con módulos ES (`"type": "module"`) y SQLite (`node:sqlite`, fichero `db/users.sqlite`). Las reglas de base están en `docs/CONSTITUTIONS.md`. Esa guía enlaza a la arquitectura, el árbol, la base de datos, los errores y el estilo.

## Comandos

- Ejecutar: pegar el contenido de `clients/terminal/` en la terminal, con el directorio actual en `first-app`.
- Jupyter: `pnpm jupyter` desde `first-app` (abre Notebook sobre `clients/jupyter/`; la primera vez crea `.venv` e instala Notebook).
- Tests: no hay tests automatizados. El script `test` de `package.json` es el placeholder de npm. El test manual son los `.txt` de `clients/terminal/` o sus notebooks en `clients/jupyter/`.
- Lint/formato: Prettier, formato estándar. No hay script de lint ni de formato.
- Dependencias: se instalan con pnpm, no con npm.

## Estilo y convenciones

La forma de cada línea y las convenciones están en `docs/STYLE.md`.

## Reglas

- Lee docs/CONSTITUTIONS.md y, antes de tocar código, `docs/specs/<nombre>/spec.md`, `plan.md` y `tasks.md`, en ese orden.
- Temperatura próxima a 0. No inventes: cíñete al plan. El código se escribe solo cuando están aceptados.
- No hay bucle. No reescribas un fichero anterior salvo que la persona lo pida.
- En cada tarea: investiga antes de escribir y compara si la tarea tiene parentesco con otra ya resuelta. El código que ya existe sirve para ver a qué fichero se parece una función nueva. La forma de cada línea se copia de `docs/STYLE.md`. Un spec nuevo no se para porque el código ya escrito no tenga esa forma.
- Si un desarrollo añade o quita un fichero, su spec también actualiza `docs/TREE.md` y `docs/ARCHITECTURE.md`.
- Si aparecen dos fuentes de verdad o dos procedimientos que se contradicen (la constitución, el código actual, una spec, un plan o esta guía), no se elige uno. Se pregunta qué camino seguir y si hay que modificar la documentacion antes de empezar la spec nueva. No se escribe código hasta tener esa respuesta.
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

## Al terminar cualquier tarea

- Al crear una funcionalidad se crea su primer cliente en `clients/terminal/`, un `.txt` que se pega en la terminal con el directorio actual en `first-app`. Ese cliente importa la función de `logic/` y hace `console.log` del resultado. Es el test manual básico.
- Comprueba que el desarrollo nuevo funciona antes de dar la tarea por terminada. La comprobación es ejecutar ese fragmento de `clients/terminal/`.
