# El paquete vive dentro del repositorio del curso

El paquete se instala desde una subcarpeta del repositorio del curso (`venturars/neoland-102026/exercises/git-workflow-agent-template`) en vez de tener un repositorio propio, para no crear y mantener otro repositorio mientras dura el bootcamp. APM solo descarga esa subcarpeta, así que el tamaño del repositorio no pesa. El precio es que la instalación depende de que el repositorio siga siendo público y la carpeta no cambie de sitio, y que las etiquetas de versión se comparten con todo el repositorio y por eso llevan prefijo: `git-workflow-agent--vX.Y.Z`.

## Consecuencias

- Pasar a un repositorio propio es copiar la carpeta y cambiar una línea de instalación. Es el siguiente paso si el paquete tiene que durar más que el curso.
