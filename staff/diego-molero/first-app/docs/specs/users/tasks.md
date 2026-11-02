# Tareas — gestión de usuarios

## Trabajo previo

- [x] Separar abrir la conexión de crear explícitamente la tabla con SQL propio.
- [x] Usar consultas directas y conservar validaciones y resultados normalizados.
- [x] Preparar los siete clientes de usuarios y simplificarlos sin try/catch/finally.
- [x] Comprobar manualmente CRUD, errores e inicialización en una copia temporal.
- [x] Separar las specs de usuarios y clasificador y generalizar las reglas comunes.

## Registro del 20 de octubre de 2026

Se preparó el proyecto y se ejecutaron los siete clientes en una copia temporal.
El alta normalizó nombre y correo; funcionaron las búsquedas, la actualización
parcial y el borrado. Repetir la inicialización conservó tres usuarios y sus datos.

Con el contrato anterior, las validaciones señalaban entradas, nombres, correos,
identificadores y cambios inválidos, usuarios inexistentes y correos duplicados.
Este registro es anterior al cambio a excepciones.

Tras simplificar los clientes se ejecutaron de nuevo. Antes de inicializar,
list-users mostró no such table: users y terminó con código 1. Las copias se
eliminaron sin utilizar la base personal ni crear archivos de tests.

La reorganización retiró app.js, el validador independiente, repositorios,
servicios, demos agrupadas, README y la spec de búsqueda por ID. Se revisaron
el árbol, la conexión, imports, enlaces, sintaxis y UTF-8. El registro del
clasificador está en [sus tareas](../classifier/tasks.md).

La revisión documental posterior comprobó ocho documentos y 24 enlaces locales.
En esa entrega solo se escribieron documentos, sin ejecutar la app.

## Iteración del 21 de octubre de 2026

- [x] Lanzar Error en validaciones y conflictos, sin códigos propios.
- [x] Devolver usuarios y listas directamente; eliminar no devuelve datos.
- [x] Adaptar el ejemplo de borrado y centralizar las instrucciones de ejecución.
- [x] Simplificar los textos y revisar enlaces, sintaxis y UTF-8.
- [x] Comprobar manualmente el nuevo contrato en una base aislada.

En una copia temporal se ejecutaron los siete clientes. Crear, buscar y actualizar
devolvieron usuarios; listar devolvió listas y eliminar devolvió undefined.
Se observaron excepciones Error para las siete validaciones documentadas,
incluyendo el conflicto UNIQUE al insertar directamente desde consultas.
Ninguna de esas excepciones tenía un código propio. El alta duplicada y la
búsqueda tras borrar terminaron con código 1 en la terminal.

La actualización parcial conservó los campos omitidos y repetir la inicialización
conservó los datos. Se comprobó sintaxis, imports, enlaces y UTF-8, y se verificó
que la documentación de ejecución está centralizada en la constitución.
La copia temporal se eliminó; el hash de la base personal no cambió.

## Casos manuales adicionales

- [x] Observar los límites exactos de 64 y 65 caracteres en el correo.
- [x] Observar el listado vacío y el borrado repetido en una base aislada.

## Iteración del 27 de octubre de 2026

Se conserva el contrato anterior después de comparar 69 escenarios en copias temporales. Los nueve comandos de terminal y notebooks funcionan; la búsqueda por nombre tiene su propia spec y comprobaciones. Se verificaron altas, búsquedas, cambios parciales, duplicados, errores y borrados sin tocar la base personal.
