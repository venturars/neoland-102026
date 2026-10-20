# Tareas — reorganización como la PR

- [x] Adaptar consultas al singleton y conservar filas y conflictos normalizados.
- [x] Adaptar operaciones directas y conservar validaciones, errores y resultados.
- [x] Integrar Ollama en el fichero del clasificador conservando su comportamiento.
- [x] Crear los ocho clientes txt y sus comandos pnpm.
- [x] Consolidar constitución e instrucciones en los nombres de la PR.
- [x] Retirar capas, documentación y clientes anteriores que se han sustituido.
- [x] Comparar el árbol final con la referencia y revisar imports, enlaces y UTF-8.
- [x] Comprobar manualmente CRUD, errores y clasificador real en una copia temporal.

## Registro

Comprobaciones realizadas el 20 de octubre de 2026 sobre la nueva estructura:

- Árbol: 33 archivos, sin archivos ni directorios adicionales respecto a la PR
  en el commit de referencia. Se excluyen node_modules y auxiliares de SQLite.
- Conexión: contenido idéntico byte a byte al de la referencia.
- Sintaxis de JavaScript y clientes txt, imports relativos, enlaces Markdown,
  UTF-8 y espacios finales: sin incidencias. git diff --check sin errores.
- En una copia temporal sin la base personal, pnpm 11.25.0 ejecutó
  `pnpm install --frozen-lockfile --offline` y los ocho clientes mediante
  `pnpm run db:init`, `create-user`, `find-user-by-email`, `find-user-by-id`,
  `update-user`, `list-users`, `classify` y `delete-user`.
- Alta normalizada, búsqueda, actualización parcial y borrado: resultados
  correctos en consola. Los duplicados conservan EMAIL_ALREADY_USED;
  los casos inválidos conservan INVALID_INPUT, INVALID_NAME, INVALID_EMAIL,
  INVALID_ID y EMPTY_CHANGES. Tras eliminar, la búsqueda devuelve USER_NOT_FOUND.
- Repetir db:init conservó los tres usuarios y sus datos. La clasificación vacía
  devolvió tres ceros. Con Ollama real y llama3.2, Ada Lovelace, Mateo y Alex
  produjeron women: 1, men: 1, genderUndefined: 1; la suma coincide con los tres
  usuarios procesados.

La copia temporal se eliminó al terminar. No se utilizó la base personal ni se
crearon archivos de tests. Esta comprobación manual no mide la precisión general
del modelo ni cubre todos los posibles fallos de red.

## Ajuste posterior de los clientes de terminal

- [x] Simplificar los ocho ejemplos sin try/catch/finally, como en la PR.
- [x] Actualizar constitución y AGENTS para reflejar el formato sencillo.
- [x] Comprobar los ocho comandos pnpm y el fallo técnico sin tabla en una copia
  temporal, además de sintaxis y UTF-8.

Comprobado el 20 de octubre de 2026: los ocho comandos finalizaron correctamente
en una copia temporal con pnpm 11.25.0. Ollama real devolvió women: 1, men: 0,
genderUndefined: 0 para Ada Lovelace. Antes de inicializar, list-users mostró
el error de Node no such table: users y terminó con código 1. La copia se eliminó;
no se utilizó la base personal. Sintaxis, UTF-8 y git diff --check sin errores.
