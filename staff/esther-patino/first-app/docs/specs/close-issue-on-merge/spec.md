# Cerrar la issue al fusionar en la rama por defecto

Issue: #706.

Quien enlaza una pull request deja `Closes #N` y la barra Development. La issue sigue abierta. Nadie la cierra con una llamada. GitHub la cierra al fusionar esa pull request en la rama por defecto. La base de la pull request sigue siendo staging. Si la rama por defecto sigue siendo main, fusionar en staging no la cierra.

Lo usa quien construye la app con IA.

Entra una pull request de esta app. Al enlazar, el cuerpo lleva `Closes #N` y la issue sigue abierta. Al fusionar en la rama por defecto, la issue queda cerrada. Al fusionar solo en staging, sigue abierta.

Ejemplo: se abre el borrador de la pull request y se enlaza la issue. La issue sigue abierta. Se fusiona en staging. La issue sigue abierta. Se fusiona en main. La issue queda cerrada.

No hay un fallo de la lista «Errores». Si la issue se cierra al abrir, al enlazar o al fusionar solo en staging, el flujo no está bien.

Queda fuera cambiar la base de la pull request, las reglas de negocio, la base de datos, los clientes y los paquetes.
