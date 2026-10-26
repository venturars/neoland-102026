# Buscar contactos por nombre exacto

Especificación aprobada por Miguel el 2026-10-22.

Tarea: [issue #208](https://github.com/venturars/neoland-102026/issues/208).

## Propósito y usuario

Quien usa la aplicación quiere consultar todos los contactos guardados con un nombre concreto, aunque varias personas compartan ese nombre.

## Entrada y resultado

Se recibe un nombre como texto, conforme a la suposición de entradas correctamente tipadas de la constitución. Los espacios al principio y al final no cuentan. El nombre completo debe coincidir con el guardado, respetando mayúsculas y minúsculas.

Se devuelve una lista con todos los contactos coincidentes, ordenada de menor a mayor ID. Cada contacto contiene exactamente `id`, `name`, `email`, `createdAt` y `updatedAt`, conservando sus valores guardados. Sin coincidencias, incluida una lista de contactos vacía, el resultado es `[]`.

La consulta no modifica ningún contacto ni sus fechas, tanto si tiene éxito como si falla.

## Fallos visibles

- Un nombre vacío o compuesto solo por espacios produce `Name is empty`.
- Si no se pueden recuperar los contactos, se informa `Could not find the user`.
- No encontrar coincidencias es un resultado vacío, no un fallo.

## Ejemplo

Con dos contactos llamados Ada, de ID 1 y 2 y con emails distintos, y otro llamado Ada Lovelace de ID 3:

- Buscar `Ada` o ` Ada ` devuelve los contactos 1 y 2, en ese orden y con sus cinco campos.
- Buscar `ada`, `Ad` o un nombre inexistente devuelve `[]`.
- Buscar `""` o `"   "` produce `Name is empty`.

## Fuera de alcance

Búsquedas parciales o sin distinción de mayúsculas, devolver solo una coincidencia, nuevas reglas de validación de tipos, escrituras, cambios en otras operaciones, cambios del clasificador, IA, autenticación e interfaces nuevas.

## Preguntas pendientes

Ninguna decisión de negocio pendiente dentro del alcance aprobado.
