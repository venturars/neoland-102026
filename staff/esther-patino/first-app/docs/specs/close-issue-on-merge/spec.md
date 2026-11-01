# Cerrar la issue al fusionar la pull request

Issue: #706.

Quien enlaza una pull request deja `Closes #N` y la barra Development. La issue sigue abierta. Se cierra cuando la pull request se fusiona.

Lo usa quien construye la app con IA.

Entra una pull request de esta app. Al enlazar, el cuerpo lleva `Closes #N` y la issue sigue abierta. Al fusionar, la issue queda cerrada. Si GitHub ya la cerró al entrar en `main`, no se vuelve a cerrar.

Ejemplo: se abre el borrador de la pull request y se enlaza la issue. La issue sigue abierta. Se fusiona la pull request. La issue queda cerrada.

No hay un fallo de la lista «Errores». Si la issue se cierra al abrir o al enlazar la pull request, el flujo no está bien.

Queda fuera cambiar la base de la pull request, las reglas de negocio, la base de datos, los clientes y los paquetes.
