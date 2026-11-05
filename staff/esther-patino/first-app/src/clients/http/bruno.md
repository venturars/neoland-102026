# Bruno — cliente HTTP

Desde `first-app` hacen falta **dos terminales** además de la de Bruno:

1. Terminal A: `pnpm server` (escribe `http://127.0.0.1:3000`).
2. Terminal B: `pnpm http` (escribe `http://127.0.0.1:3001`).
3. Terminal C: con la lista vacía, `pnpm bruno` (carpeta `01-sql-online`).

Si falta el server o el HTTP, `prebruno` lo dice antes de lanzar las
peticiones. Un `ECONNREFUSED` en 3001 significa que no está `pnpm http`.

Para probar con la base caída y el cliente HTTP abierto:

1. Para solo el proceso de `pnpm server`. Deja `pnpm http` en marcha.
2. Desde `first-app`, lanza:

```
cd src/clients/http/bruno && node ../../../../node_modules/@usebruno/cli/bin/bru.js run 02-sql-offline -r
```

La colección también se abre en la app de escritorio de Bruno apuntando
a `src/clients/http/bruno/`.
