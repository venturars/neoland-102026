# Plan de corrección de las tres pantallas

Issue: #760. Referencia: [spec](spec.md). Corrección solicitada el 2026-11-03.

- Conservar las tres secciones HTML, los estilos y la navegación.
- Usar rutas relativas y script clásico defer para abrir index.html con file://.
- Sustituir fetch por una lista de ejemplos y localStorage; guardar selección por
  ID, edición, cancelación y eliminación confirmada. Mantener la lista vacía al
  recargar; ofrecer restablecer ejemplos con confirmación.
- Mostrar el carácter ficticio de los contactos y el aviso si no se puede guardar.
- Eliminar los dos módulos HTTP, sus pruebas y comandos web/test:web.
- Actualizar README, arquitectura, árbol y la descripción de la constitución.
  Mantener intactas las operaciones Node, SQL, base real, Jupyter y dependencias.
- Verificar el archivo HTML en Chromium con perfil temporal, sin servidor:
  estilos, navegación, edición/recarga, errores, cancelar/borrar, lista vacía,
  restablecer, teclado, móvil y almacenamiento bloqueado. Comprobar que no hay
  peticiones HTTP ni errores JavaScript. Formato y lint en una copia sin SQLite.

Sin paquetes nuevos. Miguel autorizó el 2026-11-03 terminar y publicar esta
corrección en la PR #762, conservando su destino staging. Revisar antes de los
commits y del push mediante los subagentes del flujo Git. Sin merge ni cierre
de la issue #760.
