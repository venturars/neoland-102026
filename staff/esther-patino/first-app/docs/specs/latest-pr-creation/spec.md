# Apertura de la pull request en un solo paso

Issue: #928.

Quien construye esta app con IA abre la pull request como la plantilla actual. Esa apertura la deja con base staging, en borrador y asignada a quien está autenticado, en un solo paso. Si la tarea ya está escrita y el trabajo siguiente cambia el proyecto, el momento siguiente es empezar: la rama sale de staging antes de cambiar nada. Antes de pasar al paso siguiente, se confirma que el anterior ha salido bien.

Lo usa quien construye la app con IA.

Entra una tarea ya escrita y una rama ya subida. Sale la pull request en borrador, asignada a quien está autenticado. Si esa pull request ya existía, se actualiza el cuerpo, se conserva el enlace con la tarea, y entonces se asigna y se deja en borrador. La tarea sigue abierta. Nadie la cierra con una llamada.

Ejemplo: se pide traer la apertura de la plantilla. La tarea queda escrita. La rama sale de staging. La pull request nace en borrador y asignada, en un solo paso. Se guarda el trozo. La tarea sigue abierta.

No hay un fallo de la lista «Errores». Si la pull request nueva nace lista para revisión, sin persona asignada, o en varios pasos, el flujo no está en esta app. Si al reutilizar una pull request se pierde el enlace con la tarea, el flujo no está bien.

Queda fuera cambiar el enlace con `Closes #N`, las reglas de negocio, la base de datos, los clientes, los paquetes y el título en inglés con el cuerpo en español.
