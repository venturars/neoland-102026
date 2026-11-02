# Adaptar el flujo de git

Issue: #590.

Quien trabaja en esta app sigue el flujo de git del curso: pensar la
tarea, dejarla escrita, empezarla, guardar un trozo y pedir que la
revisen. Ese stack vive dentro de esta app, no en la carpeta staff.

Lo usa quien construye la app con IA.

Entra una tarea de esta app. Sale la tarea escrita, con el título en
inglés y el cuerpo en español. Al empezar, la rama sale de staging. Al
guardar, entra ese trozo. Al pedir revisión, quien pide nombra a los
revisores y la pull request deja de ser borrador. Enlazar la tarea no
la cierra. Antes de escribir la spec hay una issue con número. La spec
abre con ese número.

Ejemplo: se pide un cambio. Queda escrito qué hay que hacer y cómo
probarlo. La rama nueva sale de staging. Se guarda el trozo pedido. Se
pide revisión nombrando a 2 personas. La pull request sale de borrador
y la tarea sigue abierta.

Aunque el flujo de git no pare, en esta app hay dos paradas. La primera
es antes de crear las tareas: una persona revisa la spec y el plan. La
segunda es al crear las tareas.

No hay un fallo de la lista «Errores». Si la rama no sale de staging,
si el enlace cierra la tarea, si la revisión se pide sin nombrar
revisores, si el stack queda fuera de esta app, o si la spec nace sin
issue, el flujo no está adaptado.

Queda fuera cambiar las reglas de negocio, la base de datos, los
clientes, los paquetes, el layout de capas y las specs ya escritas.
