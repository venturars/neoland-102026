# Constitución — first-app

Este archivo es el reglamento de la app. Dice qué es y qué llevan spec, plan y tasks. El orden de trabajo de Cursor está en `AGENTS.md`.

first-app es una app pequeña en Node. No es una web. Se usa desde la terminal. Guarda personas en SQLite. Más adelante puede crecer hacia login.

## Guías

- [Arquitectura](ARCHITECTURE.md) dice qué hace cada capa.
- [Árbol](TREE.md) es el dibujo de carpetas.
- [Base de datos](DATABASE.md) es la base y el SQL.
- [Errores](ERRORS.md) es las frases de error.
- [Estilo](STYLE.md) es la forma del código.

## Specs

Cada funcionalidad tiene su carpeta `docs/specs/<nombre>/` con tres ficheros. No se sobrescriben. Se escriben cortos: concreto, y sin rodeos.

`spec.md` es el negocio. Lo lee quien decide si la función es la que quiere, sin abrir el código. Dice qué se pide, quién lo usa, qué entra, qué sale con un ejemplo, y qué fallo se ve. También dice qué queda fuera. No nombra ficheros, funciones ni SQL.

`plan.md` es la técnica. Lo lee quien comprueba que el desarrollo cabe aquí. Dice qué ficheros se crean y cuáles se tocan, a qué fichero de `logic/` se parece (sin pegar su código), la firma (nombre, parámetros y salida), el SQL nuevo con parámetros con nombre (`:id`, `:name`, `:email`), y la frase de error de cada fallo, como dice [ERRORS.md](ERRORS.md).

Una funcionalidad nueva es un fichero nuevo. Si la constitución, el código y la spec no dicen lo mismo, la pregunta se escribe al final del plan y ahí se para. No hay tareas ni código hasta tener la respuesta.

`tasks.md` son los pasos, en el orden de una persona. Cada paso abre un sitio, hace una cosa y deja un resultado que se puede mirar. Un paso son como mucho cuatro líneas. Si el cambio no es una funcionalidad nueva, el grano es el mismo: mirar lo que ya existe, cambiar un sitio, comprobar.

## Cómo se lee una acción

De arriba abajo:

1. Comprobar lo que entra.
2. Comprobar las reglas (por ejemplo: el email ya existe, la persona no está).
3. Hablar con queries dentro de try/catch.
4. Devolver el valor de esa acción.
