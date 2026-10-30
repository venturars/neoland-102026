# Capas dentro de src

Issue: #603.

Quien abre la app encuentra los datos, las consultas, las reglas y los
clientes juntos, dentro de una carpeta llamada src. El funcionamiento
no cambia.

Lo usa quien escribe un desarrollo y quien prueba un cliente.

Entra la app de ahora. No entra ningún dato nuevo.

Sale el mismo resultado para cada cosa que la app ya hace. Crear,
cambiar, borrar, listar y contar por género devuelven lo mismo y fallan
con los mismos mensajes. La base sigue siendo la de ahora y se abre
desde su conexión. Un cliente de terminal se pega con el directorio
actual en mi-primer-proyecto y llama a su acción. Jupyter se abre con
el mismo comando y enseña los mismos documentos.

Ejemplo: se crea un usuario con nombre Ada y email ada@example.com.
Sale el mismo usuario que ahora. El email queda en minúsculas.

No hay un fallo nuevo de la lista «Errores». Si un resultado cambia, si
un mensaje cambia, o si datos, consultas, reglas o clientes siguen fuera
de src, el desarrollo no está hecho.

Queda fuera una funcionalidad nueva, un mensaje nuevo, cambiar el SQL,
un paquete nuevo y reescribir las specs ya cerradas.
