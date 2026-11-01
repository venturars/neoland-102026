# Spec: Buscar usuarios por nombre

Issue: #718.

## Qué queremos conseguir
Que quien consulta los usuarios pueda encontrarlos por su nombre, sin saber su email. El resultado solo se muestra: no se crea, cambia ni borra nada.

## Cómo se usa
- Entra un nombre. Los espacios del principio y del final no cuentan.
- Salen todos los usuarios cuyo nombre es exactamente ese, con las mismas mayúsculas, de menor a mayor id.
- Cada usuario trae `id`, `name`, `email`, `createdAt` y `updatedAt`.
- Si no hay ninguno, sale una lista vacía. No es un error.
- Si el nombre está vacío o no es texto, el fallo es `Name is required.`, de [ERRORS.md](../../ERRORS.md).

## Ejemplo
Guardados: Ana (`ana@mail.com`, id 2) y Ana (`ana2@mail.com`, id 9).
- `Ana` y `  Ana  ` dan las dos, primero la 2 y después la 9.
- `ana` y `Ana María` dan una lista vacía.
- `""` da `Error: Name is required.`

## Clientes
- Terminal: `Users found: [ ... ]`, o `Users found: []` si no hay ninguno.
- Jupyter: una tabla con una fila por usuario. Si no hay ninguno, se ven los encabezados y el texto `No users with that name.`

## Fuera de alcance
- Buscar por un trozo del nombre, sin distinguir mayúsculas o con búsqueda aproximada.
- Crear, cambiar o borrar usuarios.
- Cambiar la tabla.
