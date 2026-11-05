# Estilo

El código se escribe en castellano. Los nombres de las consultas, de las funciones y de los documentos que las nombran van en inglés. Un fallo es `throw new Error`, con uno de los mensajes de `docs/ERRORS.md`.

Ficheros en kebab-case. Funciones y variables en camelCase. Constantes fijas en mayúsculas (`MODEL`, `ORIGIN`, `FIND_ALL`). Exportaciones con nombre. Imports ESM con la extensión `.js`.

Una función exportada por fichero en `src/logic/`, `src/db/` y `src/clients/web/`.

Comillas dobles, punto y coma, indentación de 2 espacios. Es el formato estándar de Prettier, sin configuración propia.

El código se lee de arriba abajo, con `if` y con nombres que dicen qué hacen. No se añaden envoltorios de resultado, clases ni capas de más.

**Aviso:** `src/clients/nest/` usa clases y decoradores porque Nest los exige. Es la única excepción. El resto del proyecto sigue igual.

En el navegador, los textos que vienen de la base se ponen con `textContent`, nunca con `innerHTML`.
