# Guías separadas por tema

Issue: #451.

## Qué se pide

Cada tema de las guías vive en un fichero. La arquitectura, el árbol, la base de datos, los errores y el estilo no comparten documento.

No se reescribe el JavaScript ni el SQL.

## A quién obliga

A quien escribe un desarrollo de esta app y a quien comprueba que ese desarrollo cabe en las guías.

## La regla

La arquitectura dice la responsabilidad de cada capa y de cada fichero. El árbol solo muestra carpetas y ficheros. La base de datos y las queries se leen juntas, con el texto que ya tenían. Los errores siguen siendo la lista de ahora. El estilo conserva las convenciones de ahora.

Esas convenciones son: el código en inglés, los comentarios de terminal en español, los ficheros en kebab-case, las funciones y variables en camelCase, los exports con nombre, los imports con `.js`, el SQL con parámetros con nombre, sin envoltorios ni helpers genéricos, Prettier estándar y las constantes en mayúsculas.

La frase de leer el código con `if` pasa a ser esta regla: una función por fichero, sin clases, sin `this` y sin métodos. Un usuario sigue siendo un registro con `id`, `name`, `email`, `createdAt` y `updatedAt`. Cada línea deja una sola acción en un nombre. Una acción es una llamada o una comprobación, así que `input.name` y `.trim()` van en líneas distintas y Prettier no las junta. Un fallo de la lista se comprueba con `if` y `throw new Error` en su propia línea. Se escribe como lo escribiría un junior a mano.

La constitución conserva las specs, los paquetes y los pasos de `logic/`. Enlaza a los ficheros nuevos y no repite la regla de la línea. La sección de constantes sale de la constitución y queda en el estilo.

El manual del agente conserva el proceso SDD, los comandos y el cierre de una tarea. Enlaza al estilo. Si un desarrollo añade o quita un fichero, su spec también actualiza el árbol y la arquitectura. La forma de cada línea se copia del estilo. El código que ya existe sirve para ver a qué fichero se parece una función nueva. Esta issue no lo reescribe. Un desarrollo posterior puede alinearlo. Mientras tanto, un spec nuevo no se para por esa diferencia.

Un texto que se mueve no se queda también en el fichero de origen. El árbol y la arquitectura incluyen los cinco ficheros nuevos.

## Ejemplo correcto

Se busca cómo se guarda un usuario. Se abre la guía de la base de datos y ahí están también las queries. El árbol no explica esa responsabilidad. La lista de errores no está copiada en otro fichero.

## Ejemplo que no se sigue

El árbol explica qué hace una capa. La misma lista de errores está escrita en dos guías. La constitución repite cómo se escribe una línea.

## Cómo se comprueba

1. Abrir las guías de arquitectura, árbol, base de datos, errores y estilo, y ver que cada una contiene solo su tema.
2. Abrir la constitución y el manual del agente, y ver que enlazan a esas guías y que el texto movido no sigue copiado ahí.

## Qué queda fuera

Reescribir el JavaScript y el SQL. Cambiar las specs ya escritas. Alinear el código viejo con la regla de la línea. Parar un spec nuevo porque el código viejo no tiene esa forma.
