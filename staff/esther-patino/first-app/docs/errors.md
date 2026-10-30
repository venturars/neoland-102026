## Errores

Si algo falla, se lanza el error y se corta la función: throw new Error("Email is invalid");

Inglés y es uno de esta lista:

| Frase | Cuándo |
| --- | --- |
| `Name is empty` | El nombre no es texto o, después de quitar espacios, queda vacío. |
| `Email is invalid` | No es texto, no tiene una sola `@` con texto a cada lado, lleva un espacio o pasa de 64 caracteres. |
| `Email is already used` | Ese email ya está en otra fila. |
| `Invalid id` | El id no es un entero mayor o igual que 1. |
| `User not found` | Se busca, se cambia o se borra un id que no está, o se busca un email que no está. |
| `Could not find the user` | SQLite falla al leer los usuarios por nombre. |
| `Could not classify the users` | La IA no responde al contar el sexo de los usuarios ya guardados, o SQLite falla al leer los usuarios. |

El email se guarda en minúsculas. `validateEmail` le quita los espacios de los extremos y lo pasa a minúsculas antes de mirar la longitud y la `@`.
