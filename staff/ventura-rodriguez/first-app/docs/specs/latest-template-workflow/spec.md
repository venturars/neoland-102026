# Dejar el flujo de git al día

Issue: #940.

Quien trabaja en esta app sigue el flujo de git del curso. Ese flujo
queda como el último de la plantilla.

Lo usa quien construye la app con IA.

Entra una tarea de esta app. Si todavía no se puede dejar escrita, la
entrevista hace las preguntas que hagan falta, cada una con una
respuesta recomendada, y para. Quien orquesta espera y vuelve a llamar
con las respuestas. Si no puede seguir con la misma entrevista, le pasa
el historial de preguntas y respuestas.

Si la tarea ya está escrita y el trabajo siguiente hace cambios, se
empieza: la rama sale de staging antes de tocar nada. Tras dejarla
escrita, si a continuación hay cambios, el momento siguiente es ese
inicio.

Al guardar un trozo, el mensaje nombra el fichero o la función y el
cambio. No usa un verbo suelto. Es una sola línea. El commit vacío de
apertura sigue igual.

Ejemplo: se pide un cambio y faltan dos datos. La entrevista devuelve
las dos preguntas, cada una con una respuesta recomendada, y para. Con
las respuestas, la tarea queda escrita y, como hay cambios, se empieza
desde staging. Al guardar, el mensaje dice qué fichero cambió y qué
cambió.

Aunque el flujo de git no pare, en esta app hay dos paradas. La
primera es antes de crear las tareas: una persona revisa la spec y el
plan. La segunda es al crear las tareas.

No hay un fallo de la lista «Errores». Si la entrevista sigue haciendo
una pregunta y esperando la respuesta antes de la siguiente, si con la
tarea ya escrita se toca el proyecto sin el momento de empezar, o si
el mensaje del trozo es un verbo suelto, el flujo no está al día.

Queda fuera el resto del flujo que ya coincide con la plantilla, las
rutas de los scripts de esta app, las reglas de negocio, la base de
datos, los clientes, los paquetes y el MCP de Socket.
