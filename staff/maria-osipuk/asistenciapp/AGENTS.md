# AGENTS.md — Cómo trabajar en AsistenciApp

Este archivo contiene solo instrucciones de trabajo. La constitución define las reglas del producto, la arquitectura explica el código y el README contiene los comandos de uso.

## 1. Fuentes de verdad

Lee estos documentos antes de editar, en este orden:

1. `docs/CONSTITUTION.md`.
2. `docs/ARCHITECTURE.md`.
3. Este archivo.
4. La spec local aprobada y sus `plan.md` y `tasks.md`.

Busca specs **únicamente** en `staff/maria-osipuk/asistenciapp/specs/`. Una spec de otra app no autoriza cambios aquí.

La arquitectura es la fuente para `domain/`, `usecases/attendance.py`, `storage/sqlite.py`, `app.py` y `static/`. No repitas esa información en este archivo.

Si una petición contradice la constitución, detente y explica el conflicto antes de escribir.

## 2. Nueva tarea: Git Flow

Toda tarea nueva sigue `docs/GIT-WORKFLOW.md` en la raíz de `neoland-102026`: issue, rama desde `staging` y pull request en draft hacia `staging`.

Cuando un mensaje describe una tarea nueva, abre solo `neoland-102026/docs/skills/create-issue/SKILL.md`, `.github/issue_template.md` y `scripts/new-issue.sh`. Enseña la persona asignada y el título, y espera autorización antes de crear la issue.

Nombrar un archivo no autoriza a modificarlo. La issue tampoco sustituye a la spec de esta app.

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
