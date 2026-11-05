# Bruno — cliente HTTP

Desde `first-app`:

1. Arranca la base con `pnpm server`.
2. Arranca el cliente HTTP con `pnpm http`. La consola escribe
   `http://127.0.0.1:3001`.
3. Con la lista vacía, lanza `pnpm bruno`. Ejecuta la carpeta
   `01-sql-online` de `src/clients/http/bruno/`.

Para probar con la base caída y el cliente HTTP abierto:

1. Para solo el proceso de `pnpm server`. Deja `pnpm http` en marcha.
2. Desde `first-app`, lanza:

```
cd src/clients/http/bruno && node ../../../../node_modules/@usebruno/cli/bin/bru.js run 02-sql-offline -r
```

La colección también se abre en la app de escritorio de Bruno apuntando
a `src/clients/http/bruno/`.
