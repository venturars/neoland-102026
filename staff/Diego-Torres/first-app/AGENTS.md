# AGENTS.md — first-app

## Proyecto

first-app es una app de usuarios para alumnos junior. Se construye con IA siguiendo el sistema SDD.

Está en Node, con módulos ES (`"type": "module"`). Los usuarios viven en un `Map` en memoria. No hay SQLite, HTTP, Jupyter ni frontend: no se añaden hasta que se pida esa iteración.

La arquitectura, el usuario, las operaciones y los errores están en `docs/CONSTITUCION.md`. Esta guía no los repite. Si una tarea y la constitución chocan, gana la constitución.

El directorio de trabajo es `staff/Diego-Torres/first-app`.

## Comandos

Desde esa carpeta:

- Dominio, a mano: `npm run paso-1`
- Casos de uso, a mano: `npm run ejemplo`
- Tests: `npm test` (`node --test`)

No hay script de lint ni de formato. No se añade uno salvo que se pida.

## Estilo

El código y los mensajes de error están en español, como el código que ya existe. No se traduce a inglés.

Ficheros en kebab-case. Funciones y variables en camelCase. Exportaciones con nombre. Imports ESM con la extensión `.js`.

El código se lee de arriba a abajo, con `if` y con nombres que dicen qué hacen. No se añaden envoltorios de resultado, helpers genéricos ni capas que oculten los pasos. Las clases de error son solo las tres de `src/dominio/errores.js`.

El formato del código ya escrito: comillas dobles, punto y coma, coma final en listas de varias líneas, indentación de 2 espacios.

## Antes de escribir

- Lee `docs/CONSTITUCION.md` y la spec de la tarea, si hay spec.
- No inventes campos, errores, carpetas ni operaciones. Cíñete a la constitución y a la spec.
- Mira el código de la operación más parecida y sigue ese estilo.
- Si la constitución, el código, una spec o esta guía se contradicen, no elijas un camino. Pregunta cuál seguir y si hay que cambiar la documentación. No escribas código hasta tener esa respuesta.

## Al terminar

- Una operación nueva lleva su prueba en `test/usuarios.test.js` y, si hace falta verla a mano, un script en la raíz de `first-app` que importe la función y haga `console.log` del resultado. Ese script no contiene reglas.
- La tarea no está terminada hasta ejecutar la comprobación. Como mínimo, `npm test`. Si el cambio se ve en `paso-1.js` o en `ejemplo.js`, ejecuta también ese comando.
- No des por bueno un código que no hayas ejecutado.
