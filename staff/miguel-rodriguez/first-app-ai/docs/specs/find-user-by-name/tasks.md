# Tareas — búsqueda por nombre exacto

Tareas aprobadas por Miguel el 2026-10-22. Pasos 1–11 completados y verificados el 2026-10-22.

Referencias: [spec aprobada](spec.md), [plan aprobado](plan.md), [constitución](../../CONSTITUTIONS.md) e [issue #208](https://github.com/venturars/neoland-102026/issues/208).

1. Revisar `queries/users.js`, los patrones existentes de listado y búsqueda por email y la versión disponible de Node.
   Confirmar soporte de `node:sqlite` y que los cambios previstos encajan con la spec y el plan; detener el trabajo afectado si aparece un conflicto.

2. Crear `queries/queries/find-by-name.sql` con la sentencia aprobada de igualdad por `:name` y orden por `id`.
   El archivo contiene únicamente SQL y no cambia el esquema ni las consultas existentes.

3. En `queries/users.js`, cargar esa sentencia una sola vez como UTF-8 mediante una ruta relativa al módulo y exportar `findByName(name)`.
   La consulta devuelve `.all({ name })`, sin validación ni impresión; las funciones anteriores se conservan.

4. Crear `logic/find-user-by-name.js` y exportar `findUserByName(name)` siguiendo el plan.
   Recorta el nombre, rechaza vacío, captura solo el fallo de consulta y devuelve objetos ordinarios nuevos con los cinco campos, en el orden recibido; ninguna coincidencia devuelve `[]`.

5. Crear `clients/terminal/find-user-by-name.txt` con el heredoc aprobado que busca `Ada` y muestra el resultado.
   Los comentarios explican el directorio y los requisitos de inicialización y creación separadas; el cliente no escribe datos.

6. Actualizar `docs/CONSTITUTIONS.md` en los apartados indicados en el plan.
   El árbol y los contratos describen nombre exacto, entrada string, lista ordenada, ausencia de escrituras y errores, sin alterar las operaciones anteriores.

7. Preparar una copia desechable sin copiar la base de datos de trabajo y ejecutar los clientes reales de inicialización y creación.
   Con `createUser()`, añadir una segunda Ada con otro email y Ada Lovelace; conservar una instantánea de todos los registros y timestamps para comparar.

8. En esa copia, ejecutar el cliente nuevo y comprobar coincidencias exactas, orden numérico de ID, cinco campos, objetos ordinarios y valores almacenados.
   Probar ` Ada `, `ada`, `Ad`, nombre inexistente, `""` y `"   "`; confirmar los resultados y mensajes exactos, y que la instantánea no cambia.

9. En bases desechables separadas, verificar tabla inicializada vacía y tabla sin inicializar.
   Con un nombre válido, la primera devuelve `[]` y la segunda lanza `Could not find the user`; una entrada vacía conserva `Name is empty` antes de consultar.

10. En la copia, verificar creación, listado, actualización, eliminación y búsquedas por email e ID con sus clientes y contactos temporales.
    Sus resultados siguen los contratos previos. No invocar ni modificar el modelo o el clasificador.

11. Eliminar todas las copias y artefactos temporales y registrar aquí comandos, versión de Node, resultados reales y cualquier comprobación bloqueada.
    Confirmar que los datos de trabajo permanecen intactos. No dejar tests persistentes, dependencias, configuración ni otros archivos; Git lo ejecuta Miguel.

## Resultados de ejecución — 2026-10-22

- Node utilizado: `v24.12.0` (`node --version`). Se implementaron únicamente los tres archivos nuevos y las ampliaciones previstas de consultas y constitución. No se modificaron operaciones anteriores ni el clasificador.
- Verificación mediante un harness temporal de Python ejecutado por stdin: `tempfile.TemporaryDirectory`, copias sin `node_modules` ni bases de datos, `/bin/zsh` para ejecutar el texto real de los clientes y `node --input-type=module` con `node:assert/strict` para las comprobaciones. No se instalaron dependencias ni quedaron tests persistentes.
- Clientes reales ejecutados: `create-users-table.txt`, `create-user.txt`, `find-user-by-name.txt`, `list-users.txt`, `find-user-by-email.txt`, `find-user-by-id.txt`, `update-user.txt` y `delete-user.txt`. Se repitió la inicialización y se conservaron los registros.
- Dos Ada con IDs 1 y 2 aparecieron en ese orden; Ada Lovelace quedó excluida. La búsqueda con espacios exteriores dio el mismo resultado. `ada`, `Ad` y un nombre inexistente devolvieron `[]`. Las entradas vacía y de espacios produjeron exactamente `Name is empty`.
- Se comprobaron los cinco campos, valores almacenados, prototipo ordinario e identidad nueva entre invocaciones. Las instantáneas de registros y timestamps antes y después de búsquedas correctas y fallidas fueron iguales.
- Una copia con tabla vacía devolvió `[]`. Otra sin inicializar produjo exactamente `Could not find the user` para un nombre válido; las entradas vacías conservaron `Name is empty` antes de consultar.
- Pasaron los clientes y las comprobaciones de creación, listado, búsqueda por email e ID, actualización parcial y eliminación; también duplicados, usuario inexistente, retorno `undefined` de eliminación y reutilización del email eliminado. La eliminación preservó los otros contactos.
- Una importación desde otro directorio siguió resolviendo el SQL y la base de datos de la copia correctamente.
- Todas las copias y artefactos temporales se eliminaron. Se compararon inventario y SHA-256 de las bases de datos de trabajo antes y después: sin cambios y sin bases nuevas en el proyecto.
- Sin comprobaciones bloqueadas dentro del alcance. No se llamó al modelo, no se ejecutó Git y no se publicó ningún cambio.
