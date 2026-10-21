# AGENTS.md — mi-primer-proyecto

## Proyecto

Primera app con IA para alumnos junior de AI Engineering. Se construye siguiendo SDD.
Node, módulos ES y una sola base SQLite en `db/users.sqlite`.
La base está en `docs/CONSTITUTIONS.md`.

## Comandos

Las dependencias se instalan con pnpm (`pnpm install`). No uses npm ni generes `package-lock.json`.
No hay comando de ejecución. No hay tests. No hay script de lint ni de formato.
El formato es el de Prettier que dice `docs/CONSTITUTIONS.md`.

## Estilo

El código va en inglés. Los comentarios de `clients/terminal/` van en español.
Ficheros en kebab-case. Funciones y variables en camelCase. Exportaciones con nombre. Los imports ESM llevan la extensión `.js`.
Se lee de arriba a abajo, con `if` y con nombres que dicen qué hacen.
Sin envoltorios de resultado, sin clases de error y sin helpers que oculten los pasos.
El contrato de `logic/` y los errores están en `docs/CONSTITUTIONS.md`.

## Reglas

- Lee `docs/CONSTITUTIONS.md` y la spec activa antes de tocar código.
- Temperatura próxima a 0. No inventes. Cíñete al plan y a la spec activa.
- Antes de escribir, mira el código ya resuelto que se parezca y sigue ese estilo.
- Si la constitución, el código, una spec o esta guía se contradicen, no elijas. Pregúntalo en el plan. No escribas código hasta tener la respuesta.
- Una tarea cada vez. El paso se deja en `- [ ]`.

## Al terminar una tarea

El primer cliente es un `.txt` en `clients/terminal/`. Se pega en la terminal con el directorio actual en `mi-primer-proyecto`. Importa la función de `logic/` y hace `console.log` del resultado.
Antes de dar la tarea por terminada, pega ese fragmento y comprueba que el resultado sale.
