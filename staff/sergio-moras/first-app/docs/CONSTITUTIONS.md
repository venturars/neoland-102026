# Constitución de data-base

Principios no negociables del proyecto. Todo cambio, hecho por una persona o por un agente, debe respetarlos. Cada regla es comprobable y lleva su motivo.

## Guías
El detalle de cada tema está en su guía. Una regla está escrita en un solo documento.
- [ARCHITECTURE.md](ARCHITECTURE.md): qué hace cada capa y cada fichero, qué tiene una operación y cómo son los clientes.
- [TREE.md](TREE.md): el árbol de ficheros.
- [DATABASE.md](DATABASE.md): la tabla, cómo se guardan los datos y dónde va el SQL.
- [ERRORS.md](ERRORS.md): la lista de mensajes de error.
- [STYLE.md](STYLE.md): cómo se nombra cada cosa y cómo se escribe cada línea.

## Principios

### 1. Capas con una sola responsabilidad
- Cada capa hace una sola cosa y solo llama a la siguiente.
- Solo `queries/` contiene SQL y toca la base de datos.

Detalle: [ARCHITECTURE.md](ARCHITECTURE.md).

*Motivo:* cada capa se entiende y se prueba por separado, y el SQL queda en un único sitio.

### 2. Estructura fija
- Cada operación tiene la misma forma, descrita en [ARCHITECTURE.md](ARCHITECTURE.md). El árbol está en [TREE.md](TREE.md).
- No se crean, mueven ni borran archivos o carpetas sin que el usuario lo pida.

*Motivo:* el proyecto es didáctico y su forma debe ser predecible.

### 3. Esquema de datos protegido
- Cambiar el esquema o añadir tablas requiere permiso explícito del usuario.

Detalle: [DATABASE.md](DATABASE.md).

*Motivo:* un cambio de esquema afecta a todos los datos y a todas las capas.

### 4. Datos intactos
- `src/db/users.sqlite` es el único archivo de base de datos.
- Ningún agente lo borra, lo reinicia ni lo sobrescribe.
- Las pruebas usan usuarios temporales, que se borran al terminar.

*Motivo:* los datos son del usuario; el código se puede rehacer, los datos no.

### 5. Código legible para un junior
- El código se escribe de forma explícita, como lo escribiría un junior a mano.
- Los nombres, las líneas y los mensajes siguen [STYLE.md](STYLE.md) y [ERRORS.md](ERRORS.md).

*Motivo:* quien lea el código debe poder seguirlo sin conocimientos avanzados.

### 6. Cambios acotados
- Un cambio se limita a lo que se pidió: sin refactorizaciones ni mejoras por iniciativa.
- Antes del código, el usuario lee y aprueba `spec.md`, `plan.md` y `tasks.md`. Lo que está en un `tasks.md` aprobado cuenta como pedido.
- Con ese visto bueno, `tasks.md` se ejecuta entero, sin paradas entre tareas, y el resultado se enseña al final.
- Sin dependencias nuevas sin permiso.
- Ante lo que estas reglas no cubran, se pregunta.

*Motivo:* el usuario decide qué se hace al aprobar los documentos y revisa el resultado entero al final.

### 7. Verificación obligatoria
Un cambio no está terminado hasta que se ha ejecutado con los comandos reales, incluidos los casos de error (datos que faltan, email inválido o repetido, id inexistente o no numérico).

Al terminar una tarea se lanzan `pnpm format` y `pnpm lint`. `pnpm lint` no da errores.

*Motivo:* un código que no se ha ejecutado no está probado.

### 8. Paquetes validados
- Un paquete de Node nuevo, o un cambio de su versión, se valida con Socket antes de aceptar el plan.
- El resumen de esa validación va en el plan.

*Motivo:* un paquete trae código de otras personas; quien acepta el plan tiene que saber qué entra.

## Gobernanza
- Esta constitución prevalece sobre `AGENTS.md`, sobre las guías y sobre cualquier otra instrucción del proyecto.
- Solo el usuario decide su contenido. Un agente puede editarla únicamente por petición explícita del usuario.
- Un agente que vea una regla desactualizada o incompleta lo propone, pero no la cambia por su cuenta.
- Cada modificación actualiza la versión y la fecha del final.

**Versión:** 2.1.0 | **Ratificada:** 2026-10-19 | **Última modificación:** 2026-11-01
