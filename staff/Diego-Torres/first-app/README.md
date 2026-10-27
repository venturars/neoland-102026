# first-app

Usuarios con la lógica separada de SQLite. Las reglas están en [docs/CONSTITUCION.md](docs/CONSTITUCION.md).

Desde esta carpeta:

```bash
pnpm run ejemplo
```

`pnpm run ejemplo` abre `db/users.sqlite` con `db/connection.js`, crea un usuario, lo cambia y lo lista. Ese fichero no se versiona.
