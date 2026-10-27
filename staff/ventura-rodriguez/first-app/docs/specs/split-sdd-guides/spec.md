# Guías separadas por tema

Issue: #402.

Quien construye la app con IA lee cada tema en su propio sitio. La
arquitectura, el árbol, la base de datos, los errores y el estilo no
comparten documento.

Lo usa quien escribe un desarrollo y quien comprueba que cabe en las
guías.

Entran las guías de ahora y las reglas de estilo ya acordadas.

Sale una guía por tema. La base de datos y las queries se leen juntas.
El árbol solo muestra carpetas y ficheros. La arquitectura dice qué
hace cada capa y cada fichero. Los errores siguen siendo la lista de
ahora. El estilo conserva las convenciones de ahora y dice cómo se
escribe una línea.

Ejemplo: se busca cómo se guarda un usuario. Se lee la guía de la base
de datos y ahí están también las queries. El árbol no explica esa
responsabilidad.

Una línea del código nuevo hace una sola acción y deja el resultado en
un nombre. Una acción es una llamada o una comprobación, así que tomar
`input.name` y aplicar `.trim()` van en líneas distintas. Prettier pone
el formato y no junta esas líneas. Un fallo de la lista se comprueba
con `if` y `throw new Error` en su propia línea. No hay clases, no hay
`this` y no hay métodos. Un usuario sigue siendo un registro con `id`,
`name`, `email`, `createdAt` y `updatedAt`. Hay una función por
fichero. Se escribe como lo escribiría un junior a mano.

Si un desarrollo añade o quita un fichero, también actualiza el árbol y
la arquitectura. La forma de una línea nueva se copia del estilo. El
código que ya existe sirve para ver a qué función se parece. Un
desarrollo nuevo no se para porque el código viejo junte varias
acciones en una línea.

No hay un fallo de la lista «Errores». Si un tema sigue escrito en dos
guías, la separación no está hecha.

Queda fuera reescribir el JavaScript y el SQL, cambiar los cuatro pasos
de una función, cambiar las reglas de paquetes, cambiar las specs ya
escritas y alinear el código viejo con la regla de la línea.
