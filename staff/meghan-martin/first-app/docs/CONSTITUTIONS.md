# Constitución — first-app

Este archivo es el reglamento de la app. Dice qué es y qué llevan spec, plan y tasks. El orden de trabajo de Cursor está en `AGENTS.md`.

first-app es una app pequeña en Node. No es una web. Se usa desde la terminal. Guarda personas en SQLite. Más adelante puede crecer hacia login.

## Guías

- [Arquitectura](ARCHITECTURE.md) dice qué hace cada capa.
- [Árbol](TREE.md) es el dibujo de carpetas.
- [Base de datos](DATABASE.md) es la base y el SQL.
- [Errores](ERRORS.md) es las frases de error.
- [Estilo](STYLE.md) es la forma del código.
```
first-app/
  AGENTS.md
  README.md
  SKILL.md
  MCP.md
  package.json
  .gitignore
  .github/
    pull_request_template.md
  src/
    db/
      connection.js
    queries/
      users.js
      queries/
        create-users-table.sql
        find-all.sql
        find-by-email.sql
        find-by-id.sql
        insert.sql
        remove.sql
        update.sql
    logic/
      create-user.js
      list-users.js
      update-user.js
      delete-user.js
      find-user-by-email.js
      find-user-by-id.js
      users-gender-count.js
    clients/
      terminal/
        create-users-table.txt
        create-user.txt
        list-users.txt
        update-user.txt
        delete-user.txt
        find-user-by-email.txt
        find-user-by-id.txt
        users-gender-count.txt
      jupyter/
        create-users-table.ipynb
        create-user.ipynb
        list-users.ipynb
        update-user.ipynb
        delete-user.ipynb
        find-user-by-email.ipynb
        find-user-by-id.ipynb
        users-gender-count.ipynb
  docs/
    CONSTITUTIONS.md
    GIT-WORKFLOW.md
    specs/
      buscar-por-id/
        spec.md
        plan.md
        tasks.md
      recuento-generos/
        spec.md
        plan.md
        tasks.md
      paquetes-socket/
      jupyter-client/
        spec.md
        plan.md
        tasks.md
```

`src/db/users.sqlite` existe en disco y no se sube a git.

- `src/db/connection.js` abre la única conexión y la exporta como `db`. No se abre otra base ni otra conexión.
- `src/queries/queries/*.sql` son solo sentencias. `src/queries/users.js` las lee y las ejecuta. Ahí no se decide si un email es válido.
- `src/logic/` es la app. Cada acción es su propio fichero, con sus comprobaciones dentro. Un fichero ya creado no se reescribe para meter otra acción. Las reglas no se mueven a queries ni a clients.
- `src/clients/terminal/*.txt` no son programas. Se pegan con el directorio actual en `first-app`. Solo ahí se imprime el resultado.
- `src/clients/jupyter/*.ipynb` llaman a la misma acción que su `.txt`. Se abren con `npm run jupyter` desde `first-app`. No cambian `logic/`.
- Una acción nueva es un fichero nuevo en `src/logic/` y un `.txt` nuevo en `src/clients/terminal/`.

## Specs

Cada funcionalidad tiene su carpeta `docs/specs/<nombre>/` con tres ficheros. No se sobrescriben. Se escriben cortos: concreto, y sin rodeos.

`spec.md` es el negocio. Lo lee quien decide si la función es la que quiere, sin abrir el código. Dice qué se pide, quién lo usa, qué entra, qué sale con un ejemplo, y qué fallo se ve. También dice qué queda fuera. No nombra ficheros, funciones ni SQL.

`plan.md` es la técnica. Lo lee quien comprueba que el desarrollo cabe aquí. Dice qué ficheros se crean y cuáles se tocan, a qué fichero de `logic/` se parece (sin pegar su código), la firma (nombre, parámetros y salida), el SQL nuevo con parámetros con nombre (`:id`, `:name`, `:email`), y la frase de error de cada fallo, como dice [ERRORS.md](ERRORS.md).

Una funcionalidad nueva es un fichero nuevo. Si la constitución, el código y la spec no dicen lo mismo, la pregunta se escribe al final del plan y ahí se para. No hay tareas ni código hasta tener la respuesta.

`tasks.md` son los pasos, en el orden de una persona. Cada paso abre un sitio, hace una cosa y deja un resultado que se puede mirar. Un paso son como mucho cuatro líneas. Si el cambio no es una funcionalidad nueva, el grano es el mismo: mirar lo que ya existe, cambiar un sitio, comprobar.

## Paquetes

Un paquete de Node nuevo, o un cambio de su versión, se comprueba con Socket antes de aprobar el plan. Entran la versión exacta y las dependencias, hasta tres capas. El plan trae un resumen: si esa versión está en una campaña, si tiene una alerta y si alguna puntuación baja de 50. Cada dato dice de dónde sale. Si una fuente no puede contestar, el resumen dice el motivo.

Las alertas las decide quien aprueba el plan. No se instala el paquete ni se cambia `package.json` ni el lock antes de que esa persona haya leído la spec y el plan.

Queda fuera un paquete que no es de Node, un paquete cuya versión no cambia, y una dependencia más allá de la tercera capa.

## Base de datos

Hay una sola base: `src/db/users.sqlite`. Hay una sola conexión: el `db` que exporta `src/db/connection.js`.

Tabla `users`:

- `id` es `INTEGER PRIMARY KEY`. SQLite lo incrementa solo: 1, 2, 3…
- `name` es `TEXT NOT NULL`.
- `email` es `VARCHAR(64) NOT NULL UNIQUE`.
- `createdAt` y `updatedAt` son fechas. SQLite no tiene un tipo `DATE`. El tipo es `TEXT` con `YYYY-MM-DD HH:MM:SS`, que es lo que devuelve `datetime('now', 'localtime')`.

Una persona que devuelve logic es un objeto plano con exactamente `id`, `name`, `email`, `createdAt` y `updatedAt`. No se devuelve la fila cruda de SQLite.

El email se recorta, se pasa a minúsculas y lleva un solo `@`, con las dos partes llenas, sin espacios y con longitud de hasta 64. Si no, no es un email válido.

## Cómo se lee una acción

De arriba abajo:

1. Comprobar lo que entra.
2. Comprobar las reglas (por ejemplo: el email ya existe, la persona no está).
3. Hablar con queries dentro de try/catch.
4. Devolver el valor de esa acción.
