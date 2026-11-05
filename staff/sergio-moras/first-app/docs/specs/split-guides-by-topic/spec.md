# Spec: Guías por tema

Issue: #708.

## Qué queremos conseguir
Que quien construye la app con IA encuentre cada regla en un solo sitio. Hoy el estilo, las carpetas, la base de datos y los errores están mezclados en la constitución y en `AGENTS.md`.

## Cómo se usa
- Quien va a escribir código abre la guía del tema:
  - `docs/ARCHITECTURE.md`: qué hace cada capa y cada fichero.
  - `docs/TREE.md`: el árbol de ficheros.
  - `docs/DATABASE.md`: la tabla, sus columnas, cómo se guardan los datos y dónde va el SQL.
  - `docs/ERRORS.md`: la lista de mensajes de error.
  - `docs/STYLE.md`: cómo se escribe cada línea y cómo se nombra cada cosa.
- `docs/CONSTITUTIONS.md` se queda con los principios y enlaza a las cinco guías.
- `AGENTS.md` se queda con cómo trabaja el agente: flujo de git, comandos, verificación, límites y paquetes.

## Decisiones del usuario
- Los ficheros de `logic/`, `clients/terminal/` y `clients/jupyter/` se nombran en kebab-case: `create-user.js`.
- La tabla sigue con `created_at` y `updated_at`. Lo que devuelve `logic/` usa `createdAt` y `updatedAt`.
- Los mensajes de error son los de ahora, recogidos en una lista.
- Cada línea hace una sola acción.
- El SQL sigue en `queries/users.js`.

## Reglas de negocio
- Una regla está escrita en un solo documento. Los demás enlazan a él.
- Las guías dicen las reglas. Donde el código de hoy no las cumple todavía, la guía lo dice y remite a la tarea que lo alinea.
- `TREE.md` describe los ficheros que existen hoy.
- No cambia el código ni el comportamiento de la app.

## Ejemplo
Alguien va a crear `findUserByName`. Abre `STYLE.md` y ve que el fichero se llama `find-user-by-name.js` y que cada línea hace una acción. Abre `ERRORS.md` para elegir el mensaje si no hay nombre. Abre `ARCHITECTURE.md` para saber que necesita un fichero en `logic/`, una consulta en `queries/users.js`, un `.txt` y un notebook.

## Fuera de alcance
- Renombrar ficheros, cambiar campos devueltos o reescribir líneas: es la tarea siguiente.
- Mover carpetas a `src/`.
- Cambiar el esquema de la tabla.
- Pasar el SQL a ficheros `.sql`.
