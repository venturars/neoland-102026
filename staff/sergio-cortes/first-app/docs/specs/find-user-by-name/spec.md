# Buscar usuarios por nombre

## Qué se pide

Se buscan los usuarios ya guardados que tienen un nombre concreto. El resultado solo se muestra; no se crea, cambia ni borra nada.

## Quién lo usa

Quien quiere ver los datos de esos usuarios a partir del nombre.

## Entrada

Entra un nombre. Los espacios al inicio y al final no cuentan. El nombre tiene que ser el mismo que el guardado, con las mismas mayúsculas y minúsculas.

## Salida

Sale la lista de esos usuarios, de menor a mayor id. Cada uno trae id, name, email, createdAt y updatedAt. Si no hay ninguno, la lista está vacía.

Ejemplo si están guardadas dos Ada, ada@example.com con id 1 y ada2@example.com con id 2, y las fechas son 2026-10-21 13:00:00:

```json
[
  { "id": 1, "name": "Ada", "email": "ada@example.com", "createdAt": "2026-10-21 13:00:00", "updatedAt": "2026-10-21 13:00:00" },
  { "id": 2, "name": "Ada", "email": "ada2@example.com", "createdAt": "2026-10-21 13:00:00", "updatedAt": "2026-10-21 13:00:00" }
]
```

## Fallo

Si el nombre está vacío, el fallo es `Name is empty`.

Si no se puede leer en la base, el fallo es `Could not find the user`.

No hay filas no es fallo: la salida es una lista vacía.

## Fuera

Buscar por email, buscar por id, buscar por un trozo del nombre, devolver un solo usuario, y crear, cambiar o borrar usuarios.
