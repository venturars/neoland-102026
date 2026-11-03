# Instrucciones de trabajo — AsistenciApp

Este manual define el proceso y los cinco momentos en que interviene la persona responsable. La constitución recoge los principios del producto; la arquitectura explica el código y el README, su uso.

## 1. Alcance, redacción y fuentes

Trabaja solo dentro de la raíz de esta aplicación y sobre el pedido autorizado. Usa roles generales y rutas relativas a esa raíz en la documentación. Los comandos conservan las rutas necesarias desde el directorio de ejecución indicado.

Evita nombres personales, comparaciones con otras copias y apartados de punto de partida ligados a ramas o commits.

Antes de editar, lee la [constitución](docs/CONSTITUTION.md), la [arquitectura](docs/ARCHITECTURE.md), este manual y la spec local que cubre el cambio. Para escribir código consulta también [STYLE.md](docs/STYLE.md).

Busca specs únicamente en `specs/` de esta app. Una spec de otra aplicación no autoriza cambios aquí. La arquitectura es la fuente para las responsabilidades y dependencias; no las copies en este manual.

Una petición de explicación o revisión es de lectura. Una petición explícita de editar autoriza el trabajo dentro de su alcance y del momento en curso; nombrar un archivo no autoriza por sí solo a cambiarlo.

Si el pedido contradice un principio, explica el conflicto y presenta la enmienda antes de implementarlo. La constitución solo se modifica con aprobación explícita de la persona responsable.

## 2. Flujo Git y autorizaciones

Las operaciones de Git siguen el [orquestador local](agents/git-workflow-agent.md). Antes de elegir una operación, consulta [check-status](skills/check-status/SKILL.md).

Una tarea nueva se registra con una issue asignada a la cuenta autenticada, una rama desde `staging` y una PR en borrador hacia `staging`. Las [plantillas de issues](templates/issues/) y de [PR](templates/pull-request/) definen el título, el cuerpo y el tipo de rama.

El agente `create-pr` crea la PR. El orquestador llama después a [link-pr-to-issue](skills/link-pr-to-issue/SKILL.md) para dejar `Closes #N` y la asociación Development. El cierre automático depende de fusionar en la rama predeterminada; no cierres la issue manualmente.

Los scripts de `tools/` se ejecutan desde la raíz del repositorio, con los argumentos de archivo relativos a ella. La [guía MCP](MCPS/github-mcp-server/mcp.txt) documenta la conexión remota y utiliza marcadores de credenciales. Modificar una configuración personal requiere autorización para ese cambio.

Commit y push solo en el momento 2 (el commit vacío) y en el momento 5, cuando se piden. No se hace merge a `staging`. Una PR ya lista para revisión conserva su estado salvo petición expresa.

El orden de preparación es issue → rama → PR en borrador → spec local. Vale para cualquier cambio de un archivo de la app, incluida la documentación. Una issue, una rama o una PR no sustituye la spec local ni autoriza el código.

## 3. Cinco momentos

La persona responsable interviene solo en estos cinco momentos, en este orden. Cada uno lo pide ella; el agente se para al terminarlo y no empieza el siguiente.

| Momento         | Qué queda escrito                                                                      | Qué no se hace        |
| --------------- | -------------------------------------------------------------------------------------- | --------------------- |
| 1. Issue        | Qué hay que hacer y cómo probarlo. Si falta definirla, la entrevista va aquí, una pregunta cada vez | Rama, specs, código   |
| 2. Draft        | De un tirón: `staging` al día, rama, commit vacío, push, PR en borrador y `Closes #N`  | Specs y código        |
| 3. Specs        | `spec.md`, `plan.md` y `tasks.md` en la misma pasada, sin ok entre ellos              | Código, commit y push |
| 4. Implementar  | El cambio de las tasks                                                                 | Commit y push         |
| 5. Pull request | Solo lo que se pida sobre esa PR: subir ficheros nombrados, pedir revisión u otra cosa | Merge a `staging`     |

El código espera al momento 4, con las tres specs ya escritas. Crear archivos o pasar las pruebas no equivale a la aceptación de la persona responsable.

## 4. SDD de esta aplicación

| Fase           | Contenido                                                                                                                             |
| -------------- | ------------------------------------------------------------------------------------------------------------------------------------- |
| `spec.md`      | Problema, usuarios, historias, criterios `CA-xx`, fuera de alcance y preguntas abiertas. Explica el qué y el porqué, sin tecnologías. |
| `plan.md`      | Arquitectura, datos, rutas, archivos, verificación y cumplimiento de P1–P6 y §5–§6 de la constitución. Justifica dependencias nuevas. |
| `tasks.md`     | Pasos pequeños y ordenados, relacionados con sus `CA-xx`. Siempre que sea posible, el test va primero.                                |
| Implementación | Una tarea cada vez. Marca `[x]` solo después de comprobar su resultado.                                                               |

Si ninguna spec local cubre el cambio, crea en el momento 3 la siguiente carpeta `specs/NNN-nombre-en-kebab-case/` con los tres documentos. La spec abre con el número de la issue.

Esta cobertura incluye código, tests, README y demás documentación de la aplicación. Las dudas necesarias para decidir alcance o comportamiento se preguntan en el momento 3 o se marcan como `[NECESITA ACLARACIÓN: pregunta concreta]`. No inventes requisitos.

Si durante la implementación la spec o el plan resultan incorrectos o incompletos, dilo y no inventes el cambio.

## 5. Implementación y documentación

- Implementa únicamente lo que cubren `spec.md`, `plan.md` y `tasks.md`, y conserva los contratos ajenos al pedido.
- Usa código sencillo, explícito y lineal, con nombres descriptivos, según [STYLE.md](docs/STYLE.md).
- Justifica dependencias, capas o refactors antes de incorporarlos; no los añadas como mejoras ajenas a la tarea.
- Comprueba el comportamiento con datos temporales, sin sustituir la base real.
- Actualiza arquitectura, estilo o README cuando cambie lo que describen. La constitución cambia solo mediante una enmienda de principios o decisiones fundamentales.
- Conserva las specs históricas como registro de sus tareas; no las reescribas para describir una versión posterior de la app.
- Si arrancas un proceso para comprobar la tarea, registra su puerto y detén únicamente ese proceso al terminar. No detengas procesos existentes ajenos a la comprobación.

## 6. Verificación y cierre

La implementación está preparada para revisión cuando:

- las tareas implementadas y comprobadas están marcadas en `tasks.md`;
- `pytest` pasa;
- cada `CA-xx` tiene un test automatizado o, si es visual, una comprobación manual registrada;
- las guías afectadas y el README describen el resultado real;
- no hay cambios ajenos al alcance ni principios incumplidos.

La aceptación final corresponde a la persona responsable después de probar y aprobar el resultado. Pasar las pruebas no sustituye esa aceptación.

Al cerrar una fase, informa de los archivos cambiados, el resultado, las comprobaciones, las limitaciones y lo pendiente. Distingue trabajo local de trabajo publicado y no afirmes que algo funciona o está aprobado sin evidencia.
