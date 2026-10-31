# Constitución de data-base

Principios no negociables del proyecto. Todo cambio, hecho por una persona o por un agente, debe respetarlos. Cada regla es comprobable y lleva su motivo.

## Principios

### 1. Capas con una sola responsabilidad
El flujo es `terminal → logic → queries → db/connection.js`.
- Solo `queries/` contiene SQL.
- Solo `queries/` importa `db/connection.js`.
- `logic/` valida los datos y decide los mensajes de error; nunca ejecuta SQL.
- `queries/` ejecuta consultas; nunca valida ni decide mensajes.

*Motivo:* cada capa se entiende y se prueba por separado, y el SQL queda en un único sitio.

### 2. Estructura fija
- Una operación = un archivo en `logic/` + un `.txt` en `clients/terminal/`.
- Una operación tiene también un `.ipynb` en `clients/jupyter/`, con el mismo nombre que su archivo de `logic/`.
- Una tabla = un archivo en `queries/`.
- Cada archivo de `logic/` solo exporta su función. No lee `process.argv`, no imprime y no llama a `process.exit`. El `.txt` de `clients/terminal/` la importa y muestra el resultado.
- No se crean, mueven ni borran archivos o carpetas sin que el usuario lo pida.

*Motivo:* el proyecto es didáctico y su forma debe ser predecible.

### 3. Esquema de datos protegido
- La tabla `users` tiene `id` (autoincremental), `name`, `email` (único), `created_at` y `updated_at`.
- `updated_at` se actualiza en cada modificación.
- El email se guarda siempre sin espacios y en minúsculas.
- Cambiar el esquema o añadir tablas requiere permiso explícito del usuario.

*Motivo:* un cambio de esquema afecta a todos los datos y a todas las capas.

### 4. Datos intactos
- `db/users.sqlite` es el único archivo de base de datos.
- Ningún agente lo borra, lo reinicia ni lo sobrescribe.
- Las pruebas usan usuarios temporales, que se borran al terminar.

*Motivo:* los datos son del usuario; el código se puede rehacer, los datos no.

### 5. Código legible para un junior
- Nombres de archivos, funciones y variables, y mensajes de error y salida: en inglés.
- Comentarios en español, solo donde haya algo no evidente, más un comentario inicial por archivo.
- Sin expresiones condensadas ni trucos de sintaxis; los pasos se escriben de forma explícita.

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

*Motivo:* un código que no se ha ejecutado no está probado.

## Gobernanza
- Esta constitución prevalece sobre `AGENTS.md` y sobre cualquier otra instrucción del proyecto.
- Solo el usuario decide su contenido. Un agente puede editarla únicamente por petición explícita del usuario.
- Un agente que vea una regla desactualizada o incompleta lo propone, pero no la cambia por su cuenta.
- Cada modificación actualiza la versión y la fecha del final.

**Versión:** 1.3.0 | **Ratificada:** 2026-10-19 | **Última modificación:** 2026-10-31
