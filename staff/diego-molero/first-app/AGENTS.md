# AGENTS.md — first-app

Instrucciones para esta carpeta y sus subdirectorios.

## Proyecto y SDD

- Node.js 24.14+, módulos ES, SQLite y Ollama local. Usar pnpm 11.25.0,
  fijado en package.json; conservar pnpm-lock.yaml. No hay dependencias externas.
- Leer docs/CONSTITUTIONS.md y spec, plan y tareas de docs/specs/classifier.
  Actualizar los documentos antes de cambiar comportamiento y marcar tareas
  solo tras comprobarlas.
- Mantener el árbol de la PR #139: no añadir app.js, repositorios, servicios,
  validadores independientes, README, demos agrupadas ni specs adicionales
  sin una solicitud que cambie esta estructura.
- Mantener nuestras reglas y respuestas; reproducir el árbol no significa copiar
  los contratos ni el esquema del profesor.

## Arquitectura

- db/connection.js debe seguir idéntico a la PR: solo exporta db, con ruta fija
  a users.sqlite junto al módulo. Es un singleton por proceso.
- Crear la tabla explícitamente antes de las operaciones. Los clientes son
  ejecuciones cortas; la conexión se libera al terminar cada proceso.
- queries/queries/*.sql contiene un SQL por consulta. queries/users.js importa
  db, ejecuta SQL parametrizado y normaliza filas y conflictos UNIQUE.
- logic contiene una operación por fichero que importa las consultas necesarias.
  Las validaciones viven en cada operación; conservar coherentes sus reglas.
- users-gender-count.js incluye tanto el conteo como HTTP y JSON de Ollama.
  Envía solo nombres, en lotes de seis. Conservar modelo configurable, URL local,
  timeout, categorías y manejo de respuestas incompletas.
- clients/terminal contiene los ocho .txt de la PR. Son JavaScript que los scripts
  pnpm pasan a Node por stdin, compatibles con PowerShell. No usar Bash en ellos.
- Mantener los ejemplos simples como en la PR: importar, guardar el resultado y
  console.log. No añadir try/catch/finally ni importar db para cerrarlo. Node
  muestra los fallos técnicos; db:init importa db para mostrar las tablas.

## Contratos

- Conservar formatos { ok: true, ... } y { ok: false, error: CODIGO } descritos
  en la constitución. Los fallos técnicos se propagan como excepciones.
- CRUD síncrono; usersGenderCount asíncrono y con await. Las búsquedas devuelven
  solo cinco campos públicos y la clasificación no modifica usuarios.
- No cambiar el esquema existente: AUTOINCREMENT, correo único y fechas UTC.
  Modificar datos existentes requiere una migración definida previamente.
- Todo en UTF-8. Documentación y comentarios en español; identificadores coherentes
  y algún comentario corto por funcionalidad nueva.

## Comandos y entrega

Desde first-app:

- `pnpm install --frozen-lockfile`: preparación reproducible.
- `pnpm run db:init`: crear tabla de forma idempotente.
- `pnpm run create-user`, `update-user`, `delete-user`, `list-users`,
  `find-user-by-email`, `find-user-by-id`: clientes de usuarios.
- `pnpm run classify`: clasificador con Ollama real.

Los ejemplos crean Ada, actualizan/eliminan el ID 1 y buscan por ese ID o su correo.
Para comprobarlos, usar una copia temporal del código sin copiar la base personal.
No añadir tests ni restaurar el directorio de pruebas sin petición de Diego.
Revisar resultados manuales, imports, enlaces, árbol y UTF-8. No subir bases,
credenciales ni archivos generados. Entregar qué cambió, qué se ejecutó y sus
límites, respetando los cambios ajenos.
