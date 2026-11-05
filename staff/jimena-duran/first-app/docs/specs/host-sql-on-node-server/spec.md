Issue: #757

# Datos compartidos de usuarios

Estado: implementación local realizada y evidencia registrada; pendiente revisión humana. Esta revisión es únicamente documental y no repite comprobaciones funcionales ni autoriza publicación.

## Resultado esperado

Los clientes de terminal y Jupyter comparten los mismos usuarios y reglas mediante un único servicio local de datos. Se conservan las operaciones y sus resultados, sin incorporar en esta entrega un cliente de navegador.

## Criterios de aceptación

- CA-01. Preparar la tabla y listar las tablas disponibles no elimina usuarios existentes.
- CA-02. Crear, listar y consultar por ID, correo o nombre conserva normalización, orden y coincidencia exacta. Nombre vacío, correo inválido o repetido muestran los mensajes correspondientes.
- CA-03. Modificar conserva el ID y los campos omitidos; eliminar afecta únicamente al usuario indicado. Un usuario ausente muestra `User not found`.
- CA-04. Los clientes esperan a que termine la operación y muestran el resultado completo. Al reejecutar un listado se observan las escrituras realizadas desde el otro cliente; las salidas guardadas no se actualizan automáticamente.
- CA-05. Los fallos conservan `Name is empty`, `Email is invalid`, `Email is already used`, `User not found` y el `Could not ...` de la operación, sin revelar detalles internos ni presentar un fallo como éxito.
- CA-06. La clasificación conserva sus categorías y comportamiento sin añadir datos persistidos ni nuevas dependencias.
- CA-07. Los datos personales, clientes existentes, otras aplicaciones y trabajo ajeno se conservan. Las comprobaciones de escritura usan exclusivamente una copia desechable y usuarios ficticios.

## Límites

Servicio de datos y clientes existentes. Sin interfaz de navegador, autenticación, reglas de negocio nuevas, migraciones automáticas ni publicación. Issue #757 coordina las dos entregas documentadas.
