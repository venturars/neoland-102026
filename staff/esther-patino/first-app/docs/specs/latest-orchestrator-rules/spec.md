# Reglas nuevas del flujo de git

Issue: #836.

Quien construye esta app con IA cambia el proyecto desde una rama nueva y una pull request en borrador. Antes de dejar la tarea escrita, comprueba que está clara. Al empezar, la tarea ya está escrita y la rama sale de staging, antes de cambiar nada. El tipo de esa rama es el de la plantilla de la tarea. Si ese tipo no tiene plantilla, se usa la más cercana.

Lo usa quien construye la app con IA.

Entra una tarea de esta app. Si el problema, el resultado, el alcance y cómo probarlo están claros y encajan, la tarea queda escrita. Si hay dudas, primero se piensa. La rama nueva sale de staging, con el tipo de la plantilla, y la pull request queda en borrador antes de guardar el cambio. Al enlazar, la tarea sigue abierta. Nadie la cierra con una llamada. GitHub la cierra al fusionar en la rama por defecto. Si esa rama sigue siendo main, fusionar en staging no la cierra.

Ejemplo: se pide traer una regla de la plantilla. La tarea queda escrita. La rama sale de staging con el tipo de esa plantilla. La pull request queda en borrador. Se guarda el trozo. La tarea sigue abierta.

No hay un fallo de la lista «Errores». Si se cambia el proyecto sin rama nueva y sin pull request en borrador, si se deja escrita una tarea con dudas, si se empieza sin la tarea escrita y sin salir de staging, o si el tipo de la rama ignora la plantilla cuando sí existe, el flujo no está en esta app.

Queda fuera cambiar las reglas de negocio, la base de datos, los clientes, los paquetes, las rutas de los scripts y el título en inglés con el cuerpo en español.
