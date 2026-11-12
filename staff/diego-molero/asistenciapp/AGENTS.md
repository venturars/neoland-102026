# AGENTS.md — Manual de trabajo para agentes de IA

## 1. Antes de hacer nada: lectura obligatoria

Empieza por este manual. Después lee, en este orden, antes de comenzar una tarea:

1. La [constitución](docs/CONSTITUTION.md): las reglas no negociables, con prioridad ante conflictos.
2. La [arquitectura](docs/ARCHITECTURE.md): responsabilidades y dirección de las llamadas.
3. El [árbol](docs/TREE.md): la estructura de esta copia y los nombres de las specs.
4. El [estilo](docs/STYLE.md): las normas de escritura del código.
5. La spec activa: `specs/NNN-nombre/spec.md` (ver §4 "Estado actual").
6. Su `plan.md` y su `tasks.md`, si ya existen.

Los comandos de preparación, activación, arranque, pruebas y cierre están en el [README](README.md).

Si el pedido contradice la constitución o las instrucciones de estos documentos, **no modifiques archivos**. Explica qué pedido y qué regla entran en conflicto y espera la respuesta de la persona responsable. La constitución conserva su prioridad; una respuesta no aprueba implícitamente una enmienda.

- **Solo se edita dentro de `staff/diego-molero/asistenciapp/`.**
- **Pregunta antes de suponer.** Ante una ambigüedad, pregunta o márcala con `[NECESITA ACLARACIÓN]`.
- **Explica lo que haces.** La persona que trabaja en esta carpeta está aprendiendo SDD: al cerrar cada fase, resume qué se ha hecho, por qué y qué tiene que revisar.
- **Cambios pequeños.** Mejor varias tareas cortas que una enorme.
- **Nada de commits ni pushes** sin que la persona que trabaja en esta carpeta lo pida y confirme el mensaje y los archivos conforme al flujo de Git del repositorio.
- **Para todo lo que arranques.** Si levantas el servidor o `cloudflared` para probar, páralos al terminar y comprueba que el puerto quede libre. El [cierre de la app y el diagnóstico del puerto](README.md#5-cerrar-la-app) indican cómo hacerlo, incluida la identificación del proceso `Python` en macOS. (Incidencia del 2026-10-20 en T12.)
- **No toques la constitución** salvo para proponer una enmienda, que solo la persona que trabaja en esta carpeta aprueba según sus [reglas de enmienda](docs/CONSTITUTION.md#8-enmiendas).

---

## 2. Flujo SDD paso a paso

Cada cambio en esta aplicación recorre estas fases **en orden**, incluido cualquier cambio en código, tests, README u otra documentación de uso. Al terminar cada una, el agente **se detiene** y pide la aprobación de la persona que trabaja en esta carpeta. No se avanza sin un "ok" explícito.

Al comenzar un pedido sin una spec aprobada que lo cubra, el único archivo que se puede crear o modificar es su `specs/NNN-nombre/spec.md`. El agente presenta la spec y espera el sí antes de escribir el plan, las tareas o la implementación. Una issue, una rama o una pull request no sustituyen esa aprobación; las operaciones de Git siguen el flujo del repositorio.

| Fase | Archivo | Pregunta que responde | Puerta de salida |
| --- | --- | --- | --- |
| 1. Especificar | `spec.md` | ¿**Qué** hay que construir y **por qué**? | Sin `[NECESITA ACLARACIÓN]` pendientes + aprobación de la persona que trabaja en esta carpeta |
| 2. Planificar | `plan.md` | ¿**Cómo** lo construimos? | Pasa la comprobación de la constitución + aprobación de la persona que trabaja en esta carpeta |
| 3. Desglosar | `tasks.md` | ¿En qué **pasos pequeños** lo hacemos? | Cada tarea apunta a un criterio de aceptación + aprobación de la persona que trabaja en esta carpeta |
| 4. Implementar | código + tests + documentación prevista | Hacerlo, tarea a tarea | `pytest` en verde + criterios verificados + conformidad final de la persona que trabaja en esta carpeta |

### 2.1 Especificar (`spec.md`)
- Habla del usuario y del problema. **Nunca** nombra tecnologías (nada de "SQLite", "endpoint", "fetch").
- Estructura: Problema · Usuarios · Historias de usuario · Criterios de aceptación (Dado / Cuando / Entonces) · Fuera de alcance · Preguntas abiertas.
- Cada criterio de aceptación lleva un identificador (`CA-01`, `CA-02`…) para poder enlazarlo desde tareas y tests.
- Si falta información, escribe `[NECESITA ACLARACIÓN: pregunta concreta]`. **No inventes la respuesta.**
- Si el pedido no está cubierto por la spec activa, abre una nueva. No reutilices una spec terminada, como `001-checkin-codigo`, para autorizar ese cambio.

### 2.2 Planificar (`plan.md`)
- Arquitectura, modelo de datos, rutas/API, archivos que se crearán.
- Sección obligatoria **"Comprobación de la constitución"**: repasa P1–P6 y §5–§6 y di cómo los cumple el plan.
- Si propones una dependencia externa, justifícala aquí como indica la [constitución](docs/CONSTITUTION.md).

### 2.3 Desglosar (`tasks.md`)
- Lista de casillas `- [ ] T01 …` en orden de ejecución.
- Cada tarea es pequeña (un archivo o una función), tiene un resultado comprobable e indica qué `CA-xx` cubre.
- Primero el test, luego el código, siempre que sea posible.

### 2.4 Implementar
- Haz **una tarea cada vez**. Al acabarla, márcala `[x]` en `tasks.md`.
- Implementa únicamente las tareas aprobadas; incluye el README u otra documentación de uso cuando una tarea lo indique. Ningún archivo del cambio se adelanta a su spec aprobada ni a las aprobaciones del plan y las tareas.
- Si aparece un pedido fuera del alcance de la spec activa, detén ese pedido, escribe una spec nueva y espera su aprobación antes de continuar con sus fases.
- Si durante la implementación descubres que la spec o el plan están mal o incompletos, **para**, propón el cambio en el documento y espera aprobación. El código nunca se adelanta a los documentos.

---

## 3. Definición de "terminado"

Un cambio está terminado cuando:

- [ ] Todas las tareas de `tasks.md` están en `[x]`.
- [ ] `pytest` pasa.
- [ ] Cada `CA-xx` de la spec tiene su test o su verificación manual hecha.
- [ ] La documentación de uso prevista en las tareas explica el cambio; el `README.md` se actualiza cuando el alcance aprobado lo requiere.
- [ ] La persona que trabaja en esta carpeta ha revisado el cambio, ha realizado la comprobación que corresponde y lo ha dado por bueno.

---

## 4. Estado actual

| Spec | Fase | Notas |
| --- | --- | --- |
| `001-checkin-codigo` | ✅ Terminada v1.2 (2026-10-20): 25 tareas, 77 tests, CA-01 a CA-26 verificados | Check-in con código rotatorio, válido para cualquier plataforma |
| `002-spec-antes-del-cambio` | Terminada con conformidad final (2026-10-23) | CA-01 a CA-08 revisados; 77 tests en verde; revisión de compañeros e incorporación a `staging` pendientes |
| `003-activar-el-entorno` | Implementada y comprobada (2026-10-23); entrega autorizada | CA-01 a CA-04 revisados; 77 tests en verde; revisión de compañeros e incorporación a `staging` pendientes |
| `004-quitar-referencias-personales` | Implementada y comprobada (2026-10-23); entrega autorizada | CA-01 a CA-04 revisados; 80 tests en verde; revisión de compañeros e incorporación a `staging` pendientes |
| `005-reorganizar-arquitectura` | Implementada y comprobada (2026-10-23); entrega autorizada | CA-01 a CA-09 revisados; 93 tests en verde, incluida compatibilidad de datos; revisión de compañeros e incorporación a `staging` pendientes |
| `006-simplificar-manual-agente` | Conformidad final recibida y entrega autorizada (2026-10-30) | CA-01 a CA-09 comprobados; 13 pruebas de arquitectura y 93 de la suite en verde; issue #655; revisión de compañeros y merge pendientes |
| Bot de Discord | Idea futura, sin número | Fuera del MVP |

> El agente actualiza esta tabla cada vez que una spec cambia de fase.
