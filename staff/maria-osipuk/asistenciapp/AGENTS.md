# AGENTS.md — Cómo trabajar en AsistenciApp

Este archivo contiene solo instrucciones de trabajo. La constitución define las reglas del producto, la arquitectura explica el código y el README contiene los comandos de uso.

## Regla principal de redacción

Usa roles generales y rutas de documentación relativas a la aplicación. Evita nombres personales, comparaciones con otras copias y apartados de punto de partida basados en ramas o commits concretos. Los comandos ejecutables conservan las rutas reales necesarias desde la raíz del repositorio.

## 1. Fuentes de verdad

Lee estos documentos antes de editar, en este orden:

1. `docs/CONSTITUTION.md`.
2. `docs/ARCHITECTURE.md`.
3. Este archivo.
4. La spec local aprobada y sus `plan.md` y `tasks.md`.

Busca specs **únicamente** en `staff/maria-osipuk/asistenciapp/specs/`. Una spec de otra app no autoriza cambios aquí.

La arquitectura es la fuente para `domain/`, `usecases/attendance.py`, `storage/sqlite.py`, `app.py` y `static/`. No repitas esa información en este archivo.

Si una petición contradice la constitución, detente y explica el conflicto antes de escribir.

## 2. Flujo Git

El trabajo de Git sigue el [orquestador local](agents/git-workflow-agent.md). Según la petición, el orquestador llama al subagente o a la skill correspondiente para pensar una tarea, dejarla escrita, empezar, guardar cambios o pedir revisión.

Una tarea nueva queda registrada en una issue asignada a la cuenta autenticada, una rama desde `staging` y una pull request en borrador hacia `staging`. Antes de elegir la operación se consulta el estado con [check-status](skills/check-status/SKILL.md). Una operación ya autorizada se ejecuta dentro del alcance de esa autorización.

Las [plantillas de issues](templates/issues/) y las [plantillas de PR](templates/pull-request/) son la fuente de la forma del título, el cuerpo y el tipo de rama. Se utiliza la correspondiente al tipo de tarea o la más cercana, sin duplicar sus reglas.

El agente `create-pr` crea la pull request. Después, el orquestador llama a [link-pr-to-issue](skills/link-pr-to-issue/SKILL.md) para dejar `Closes #N` y el enlace Development. La issue permanece abierta hasta la fusión que permita su cierre automático; no se cierra a mano.

Los comandos de las siete skills de terminal incluyen la ruta de sus scripts y se ejecutan desde la raíz del repositorio. Los argumentos que nombran archivos también son relativos a esa raíz.

La [guía MCP](MCPS/github-mcp-server/mcp.txt) documenta la conexión remota y su header. Sus ejemplos usan un marcador de credenciales. Configurar una conexión externa o modificar una configuración personal requiere una petición que cubra ese cambio.

El flujo Git respeta las aprobaciones del apartado 3 y la constitución. Una issue, una rama o una PR no sustituyen a la spec local ni autorizan una fase del SDD pendiente. Nombrar un archivo tampoco autoriza a modificarlo.

## 3. Desarrollo guiado por especificaciones

El orden obligatorio es `spec.md` → aprobación → `plan.md` → aprobación → `tasks.md` → aprobación → código.

| Fase | Contenido necesario |
| --- | --- |
| `spec.md` | Problema, usuarios, historias, criterios `CA-xx`, fuera de alcance y preguntas abiertas. Explica qué se necesita, sin tecnologías. |
| `plan.md` | Arquitectura, datos, rutas, archivos y comprobación de P1–P6 y §5–§6 de la constitución. Justifica cualquier dependencia nueva. |
| `tasks.md` | Pasos pequeños y ordenados. Cada tarea indica qué `CA-xx` cubre. Siempre que sea posible, el test va primero. |
| Código | Se implementa una tarea cada vez y se marca `[x]` solo después de comprobarla. |

Si falta una decisión, escribe `[NECESITA ACLARACIÓN: pregunta concreta]` y espera. No inventes requisitos.

Si ninguna spec local aprobada cubre el cambio, crea la siguiente carpeta `specs/NNN-nombre-en-kebab-case/` y empieza únicamente por `spec.md`.

Si el plan deja de ser correcto durante la implementación, actualízalo y pide aprobación antes de continuar.

## 4. Reglas de implementación

- Edita solo dentro de `staff/maria-osipuk/asistenciapp/`.
- Implementa únicamente lo aprobado en la spec y las tasks.
- Trabaja una tarea o una responsabilidad cada vez.
- No añadas dependencias, funcionalidades, capas, refactors ni cambios de contrato no solicitados.
- No hagas commit, push ni merge sin autorización.
- No modifiques la constitución salvo para proponer una enmienda.
- Si arrancas la app o el túnel, páralos al terminar y comprueba que el puerto 8000 queda libre.

## 5. Código para una desarrolladora junior

El código nuevo y las partes modificadas deben ser:

- **Sencillo:** usa el menor número de conceptos necesario.
- **Explícito:** valida y transforma los datos en pasos visibles.
- **Declarativo:** los nombres describen la intención, como `showLiveClassroom` o `isSessionOpen`.
- **Lineal:** el caso principal se lee de arriba abajo y los errores terminan pronto.
- **Descriptivo:** usa nombres descriptivos y completos; solo admite abreviaturas habituales, como `id`.
- **Dividido:** cada función hace una sola cosa y coordina pasos con nombre.

Prefiere una solución más larga cuando sea más fácil de entender y explicar. Evita abstracciones prematuras, trucos de una línea, anidación profunda y ayudantes genéricos.

En Python, los parámetros y resultados llevan tipos. El docstring usa `:param`, `:return`, `:rtype` y `:raises`; un ejemplo breve puede añadirse en `Usage::`.

No dupliques reglas, no conviertas silenciosamente un valor inválido y no crees funciones que solo trasladen otra llamada.

La interfaz, los errores y la documentación se escriben en español. Los nombres y comentarios del código pueden estar en inglés.

### Comentarios educativos

Un comentario se escribe en inglés sencillo y con una frase completa. Solo se añade cuando explica algo que el código no puede mostrar por sí solo:

- una decisión y su motivo;
- un límite o caso especial;
- una regla de negocio, privacidad o seguridad;
- una entrada, salida o error importante;
- el orden necesario entre dos pasos.

Ejemplo útil:

```js
// Keep the first load silent so existing students are not announced as new arrivals.
```

Si un nombre más claro evita el comentario, mejora el nombre. No añadas comentarios que solo traduzcan la línea siguiente.

## 6. Verificación y cierre

Una tarea está terminada cuando:

- todas sus casillas están en `[x]`;
- `pytest` pasa;
- cada `CA-xx` tiene una prueba automática o una comprobación manual registrada;
- `README.md` explica cualquier cambio visible;
- la constitución y la arquitectura siguen siendo correctas;
- la persona responsable ha probado y aprobado el resultado.

Al cerrar una fase, informa de los archivos modificados, qué hace el cambio, qué se comprobó, el resultado y lo que queda pendiente. No afirmes que algo funciona sin haberlo comprobado.
