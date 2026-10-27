# first-app

Usuarios con la lógica separada de SQLite. Las reglas están en [docs/CONSTITUCION.md](docs/CONSTITUCION.md).

Desde esta carpeta:

```bash
pnpm test
pnpm run ejemplo
```

`pnpm test` prueba las reglas con un almacén en memoria y un caso con SQLite en `:memory:`. `pnpm run ejemplo` abre `db/users.sqlite` con `db/connection.js`, crea un usuario, lo cambia y lo lista. Ese fichero no se versiona.
