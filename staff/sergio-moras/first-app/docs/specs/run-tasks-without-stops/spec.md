# Spec: Ejecutar las tareas aprobadas sin paradas

Issue: #696.

## Qué queremos conseguir
Que quien construye la app con IA sepa cuándo se para el trabajo. Las paradas están antes del código, en los documentos. Después, el trabajo aprobado se hace entero.

Hoy la regla pide hacer los cambios de uno en uno y enseñarlos antes de seguir. Eso para el trabajo después de cada tarea, aunque el usuario ya haya aprobado la spec, el plan y las tareas.

## Cómo se usa
- El agente escribe `spec.md`, `plan.md` y `tasks.md` y se para.
- El usuario los lee y da el visto bueno.
- El agente ejecuta `tasks.md` entero, sin pararse entre tareas, y enseña el resultado al final.
- Si aparece algo que las reglas o el plan no cubren, el agente se para y pregunta.

## Reglas de negocio
- Lo que está en un `tasks.md` aprobado cuenta como pedido: crear, mover o borrar los archivos que nombra no necesita otro permiso.
- Siguen haciendo falta permiso explícito: cambiar el esquema, añadir dependencias y editar la constitución, cuando no estén en el `tasks.md` aprobado.
- `docs/CONSTITUTIONS.md` y `AGENTS.md` dicen lo mismo.

## Casos a cubrir
- El principio 6 de la constitución dice dónde están las paradas.
- «Límites» de `AGENTS.md` dice lo mismo.

## Fuera de alcance
- Cambiar el flujo de git.
- Cambiar otras reglas de la constitución o de `AGENTS.md`.
