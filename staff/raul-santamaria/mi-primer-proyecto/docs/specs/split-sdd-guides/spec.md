# Guías separadas por tema

Issue: #443.

Quien construye la app con IA lee cada tema en su propio sitio. La
arquitectura, el árbol, la base de datos, los errores y el estilo no
comparten documento.

Lo usan quien escribe un desarrollo y quien comprueba que cabe en las
guías.

Entran las reglas que hoy están en la constitución y las de estilo ya
acordadas (una acción por línea, constantes en mayúsculas, Prettier
estándar, código como lo escribiría un junior a mano, sin clases ni
métodos).

Sale una guía por tema. La base de datos y las queries se leen juntas.
El árbol solo muestra carpetas y ficheros. La arquitectura dice qué
hace cada capa y cada fichero. Los errores son la lista de mensajes que
ya usa la app. El estilo guarda las convenciones y cómo se escribe una
línea. La constitución queda como índice de guías, specs, paquetes y
contrato de las reglas de negocio.

Ejemplo: se busca cómo se guarda un usuario. Se lee la guía de la base
de datos y ahí están también las queries. El árbol no explica esa
responsabilidad.

Si un desarrollo añade o quita un fichero, también actualiza el árbol y
la arquitectura. La forma de una línea nueva se copia del estilo. El
código que ya existe sirve para ver a qué función se parece. Un
desarrollo nuevo no se para porque el código viejo junte varias
acciones en una línea.

No hay un fallo de la lista de errores. Si un tema sigue escrito en dos
guías, la separación no está hecha.

Queda fuera reescribir el JavaScript y el SQL, cambiar los cuatro pasos
de una función, cambiar las reglas de paquetes, cambiar las specs ya
escritas y alinear el código viejo con la regla de la línea.
