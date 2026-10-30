# Cómo se escribe el código

Un módulo abre con una frase que explica qué hace. Cada función realiza una tarea.

Las funciones públicas nuevas o modificadas llevan tipos en los parámetros y en el retorno, y un docstring que explica:

- `:param nombre:`: qué recibe cada parámetro.
- `:return:`: qué resultado devuelve.
- `:rtype:`: el tipo del resultado.
- `Usage::`: un ejemplo corto de cómo llamar a la función.

Las funciones internas tienen nombres claros y comentarios breves cuando explican una decisión o el cierre de recursos.

Los errores y textos de uso siguen en español. El código y los textos se guardan en UTF-8.

Las funciones conservadas y no modificadas mantienen su documentación hasta que un cambio aprobado las afecte.
