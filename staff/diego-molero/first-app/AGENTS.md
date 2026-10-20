# Instrucciones para first-app

Estas instrucciones se aplican a esta carpeta y sus subdirectorios.

## Contexto y SDD

- Proyecto de aprendizaje: gestión de usuarios con Node.js 24.14 o posterior,
  JavaScript con módulos ES y SQLite nativo (`node:sqlite`), sin dependencias externas.
- Antes de trabajar, lee `docs/constitution.md`, el README y la especificación
  relacionada, si existe.
- Antes de cambiar un comportamiento, prepara `docs/specs/<nombre>/spec.md`,
  `plan.md` y `tasks.md`. La spec define negocio y criterios; el plan, técnica y
  etapas; las tareas, pasos pequeños y verificables de la etapa activa.
- Mantén los documentos breves y marca tareas solo tras ejecutarlas. Sigue el
  alcance solicitado: una entrega documental deja pendiente la implementación.
- Implementa el alcance solicitado y mantén actualizados los documentos afectados.

## Desarrollo activo

- Lee los tres documentos de `docs/specs/classifier/`. La spec describe el
  clasificador completo; la primera etapa del plan prepara la tabla de usuarios.
- La inicialización explícita y la capa `queries/` están planificadas. Hoy
  `openDatabase` aún crea la tabla y `createApp({ db })` todavía no existe.
- No marques el clasificador como terminado al preparar la tabla. El modelo y
  la integración con IA se concretarán en etapas posteriores.

## Arquitectura

- `logic/`: una operación por fichero; validaciones comunes en `validate-user.js`.
  Recibe el repositorio como argumento. No importa SQLite ni accede a archivos,
  terminal, HTTP o interfaces gráficas.
- `repositories/sqlite-user-repository.js`: concentra el SQL parametrizado y
  devuelve objetos JavaScript normales. No contiene reglas de negocio.
- `db/`: conexión y esquema. Conserva los datos existentes al inicializar y usa
  fechas UTC en formato ISO 8601.
- `app.js`: conecta la lógica con el repositorio. Importarlo no abre conexiones;
  cada instancia debe cerrar sus recursos al terminar.
- `clients/`: recoge entradas y presenta resultados usando la aplicación.
  Actualmente solo existe una demo de terminal con datos predefinidos.

## Contratos y estilo

- Conserva los contratos síncronos y formatos de resultado documentados en el README.
  Los errores de negocio devuelven `{ ok: false, error: "CODIGO" }`; los fallos
  técnicos inesperados se propagan como excepciones.
- Valida antes de modificar datos. Comparte las reglas entre crear y actualizar;
  la búsqueda por correo reutiliza `validateEmail` de `validate-user.js`.
  No dupliques validaciones en los clientes.
- `findUserByEmail` recibe un correo como texto: normaliza, valida y consulta el
  repositorio. Devuelve `{ ok: true, user }`, `INVALID_EMAIL` o `USER_NOT_FOUND`
  con el formato de error habitual; no modifica datos ni devuelve campos internos.
- Guarda todo en UTF-8. Escribe documentación y comentarios en español y mantén
  los identificadores coherentes con el código existente.
- Cada funcionalidad nueva debe incluir algún comentario corto y explicativo.
  Prioriza funciones sencillas y justifica las nuevas dependencias.

## Verificación y entrega

- Ejecuta los comandos desde esta carpeta: `npm test` para cambios de código,
  `npm run demo` si afectan al cliente de terminal y `npm run db:init` si afectan
  a la inicialización. No hace falta ejecutar `npm install`.
- Añade o ajusta pruebas de los comportamientos afectados: negocio sin SQLite e
  integración con SQLite real cuando corresponda.
- Usa bases en memoria o archivos temporales para pruebas y demos. No modifiques
  `db/users.sqlite` para probar ni subas bases locales o credenciales a Git.
- Para cambios solo documentales, revisa contenido, enlaces y UTF-8.
- Al entregar, indica qué cambió, qué comprobaste y qué queda pendiente. Respeta
  los cambios ajenos y no presentes comprobaciones no ejecutadas como realizadas.
