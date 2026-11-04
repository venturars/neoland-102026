# first-app

## Extensión de Chrome

Desde `first-app`, deja dos terminales abiertas:

```sh
pnpm server
pnpm chrome
```

La base escribe `http://127.0.0.1:3000`. La API escribe
`http://127.0.0.1:3002`.

Chrome no carga esta extensión desde la terminal. Ábrela así:

1. Entra en `chrome://extensions`.
2. Activa el modo de desarrollador.
3. Pulsa **Cargar extensión sin empaquetar** y elige
   `src/clients/chrome`.
4. Abre el icono **Usuarios**.
