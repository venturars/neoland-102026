# Mover el código de la app a src

Issue: #598.

## Qué se pide

Quien abre first-app encuentra el código de la app dentro de `src`: la base de datos, las queries, las reglas de negocio y los clientes. El resto del proyecto sigue en la raíz de first-app.

Crear, cambiar, borrar, listar, buscar y contar por género siguen dando el mismo resultado y los mismos mensajes que ahora. El directorio actual al pegar un cliente de terminal sigue siendo first-app.

## Quién lo usa

Quien construye first-app con IA y quien abre el árbol para ver dónde vive cada capa.

## Entrada

El código de la app tal como está ahora, con esas cuatro áreas en la raíz de first-app, y un cliente de terminal pegado con el directorio actual en first-app.

## Salida

Esas cuatro áreas están dentro de `src`. En la raíz siguen la documentación, los agentes, las skills, las herramientas, los scripts, `package.json` y `eslint.config.js`.

Ejemplo: se pega el cliente que lista usuarios, con el directorio actual en first-app. Sale la misma lista que antes del traslado.

## Fallo

No hay un fallo nuevo de la lista «Errores».

Si una de esas áreas sigue en la raíz, si falta dentro de `src`, o si un cliente de terminal o un cuaderno ya no muestra el mismo resultado, el desarrollo no está hecho.

## Fuera

- Una funcionalidad nueva, un mensaje de error nuevo o un cambio de firma.
- Cambiar el SQL o el esquema de la base de datos.
- Añadir paquetes de Node o cambiar su versión.
- Mover a `src` la documentación, los agentes, las skills, las herramientas, los scripts, las plantillas, `package.json` o `eslint.config.js`.
