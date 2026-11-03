# Constitución — first-app

Si una tarea y esta constitución chocan, gana la constitución. Las guías de abajo forman parte de ella.

## Guías

- `docs/ARCHITECTURE.md` — las capas, qué sabe cada fichero, el usuario y las operaciones
- `docs/DATABASE.md` — la tabla, el servidor SQL y las consultas
- `docs/ERRORS.md` — la lista cerrada de mensajes
- `docs/STYLE.md` — cómo se escribe el código
- `docs/TREE.md` — el árbol de carpetas

## Specs

Un desarrollo nuevo pasa por `docs/specs/<nombre>/`, después de tener su issue.

- `spec.md` es el negocio. Abre con `Issue: #N`. Dice qué se pide, quién lo usa, qué entra, qué sale con un ejemplo, qué fallo se ve y qué queda fuera. No nombra ficheros ni funciones.
- `plan.md` es la técnica: ficheros que se crean, se tocan o se borran, las firmas, el SQL nuevo y qué mensaje de `docs/ERRORS.md` corresponde a cada fallo.
- `tasks.md` son los pasos, en el orden en que los haría una persona. Cada paso abre un sitio, hace una cosa y deja algo que se puede mirar.

Si la constitución, el código y la spec no dicen lo mismo, la pregunta va al final del plan y no hay tareas hasta tener respuesta.

## Paquetes

Un paquete de Node nuevo, o un cambio de versión, se comprueba con Socket antes de aceptar el plan, como dice `AGENTS.md`.

## Qué no entra

- El servidor solo escucha en `127.0.0.1`. No hay login ni contraseña.
- El servidor no envía cabeceras CORS ni sirve `src/db/`.
- No se añaden paquetes para el servidor ni para la web.
- Las reglas viven solo en `src/logic/`. Ni `src/queries/`, ni `src/db/`, ni los clientes las copian.
- Las notas aún no existen.
