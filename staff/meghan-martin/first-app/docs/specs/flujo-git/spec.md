# Spec — flujo de git al día

Quien construye esta app sigue el flujo de git del curso. Ese flujo queda como el último de la plantilla.

Si la tarea todavía no se puede dejar escrita, la entrevista hace las preguntas que hagan falta, cada una con una respuesta recomendada, y para. Quien orquesta espera y vuelve a llamar con las respuestas. Si no puede seguir con la misma entrevista, le pasa el historial.

Si la tarea ya está escrita y el trabajo siguiente hace cambios, se empieza: la rama sale de staging antes de tocar nada.

Al guardar un trozo, el mensaje nombra el fichero o la función y el cambio. No usa un verbo suelto. Es una sola línea. El commit vacío de apertura sigue igual.

La pull request se abre contra staging, en draft y asignada a quien está autenticado, en una sola llamada. Los revisores siguen siendo Miguel (`mglnglxx`) y Jimena (`jiji-mena`).

Ejemplo: faltan dos datos. La entrevista devuelve las dos preguntas y para. Con las respuestas, la tarea queda escrita y, como hay cambios, se empieza desde staging. Al guardar, el mensaje dice qué fichero cambió.

Queda fuera el resto del flujo que ya coincide, las rutas de los scripts que ya existen, las reglas de las personas, la base, los clientes y los paquetes.
