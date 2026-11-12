# Meter el flujo de git en first-app

Issue: #589.

Quien trabaja en esta app sigue el flujo de git del curso: pensar la tarea, dejarla escrita, empezarla, guardar un trozo y pedir que la revisen.

Lo usa quien construye la app con IA.

Entra una tarea de esta app. Sale la tarea escrita, con el título en inglés y el cuerpo en español. Al empezar, la rama sale de staging. Al guardar, entra ese trozo. Al pedir revisión, quien pide nombra a los revisores y la pull request deja de ser borrador. Enlazar la tarea deja `Closes #N` y la tarea sigue abierta. La tarea se cierra cuando se fusiona la pull request.

Ejemplo: se pide un cambio. Queda escrito qué hay que hacer y cómo probarlo. La rama nueva sale de staging. Se guarda el trozo pedido. Se pide revisión nombrando a 2 personas. La pull request sale de borrador y la tarea sigue abierta. Al fusionar la pull request, la tarea queda cerrada.

No hay un fallo de la lista «Errores». Si la rama no sale de staging, si la tarea se cierra antes de fusionar la pull request, o si la revisión se pide sin nombrar revisores, el flujo no está en esta app.

Queda fuera cambiar las reglas de negocio, la base de datos, los clientes, los paquetes y las specs ya escritas.
