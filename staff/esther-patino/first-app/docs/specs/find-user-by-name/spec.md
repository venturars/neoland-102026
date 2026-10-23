# Buscar usuarios por nombre

Se buscan los usuarios ya guardados con un nombre. El resultado solo se muestra.

Lo usa quien quiere ver los datos de esos usuarios a partir del nombre.

Entra un nombre. Los espacios al inicio y al final no cuentan. El nombre tiene que ser el mismo que el guardado, con las mismas mayúsculas.

Sale la lista de esos usuarios, de menor a mayor id. Cada uno trae id, name, email, createdAt y updatedAt. Si no hay ninguno, la lista está vacía.

Ejemplo si están guardadas dos Ada, ada@example.com con id 1 y ada2@example.com con id 2, y las fechas son 2026-10-21 13:00:00:

[
  { id: 1, name: "Ada", email: "ada@example.com", createdAt: "2026-10-21 13:00:00", updatedAt: "2026-10-21 13:00:00" },
  { id: 2, name: "Ada", email: "ada2@example.com", createdAt: "2026-10-21 13:00:00", updatedAt: "2026-10-21 13:00:00" }
]

Si el nombre está vacío, el fallo es `Name is empty`.

Si no se puede leer, el fallo es `Could not find the user`.

Queda fuera buscar por email, buscar por id, buscar por un trozo del nombre, devolver un solo usuario, y crear, cambiar o borrar usuarios.
