# Cliente Chrome (extensión + API local)

Popup MV3 que habla con una API Fastify en `http://127.0.0.1:3002`. La API importa `src/logic/` igual que el cliente HTTP. Requiere el servidor SQL en marcha (`POST /execute` en el puerto 3000).

## Arranque

Ver [`docs/STARTUP.md`](../../../docs/STARTUP.md).

1. Terminal en la raíz de first-app (`staff/jose-miguel/first-app`).

2. Servidor SQL:

   ```text
   pnpm server
   ```

   Debe mostrar `http://127.0.0.1:3000`. Déjalo abierto.

3. Otra terminal — API de la extensión:

   ```text
   pnpm chrome
   ```

   Debe mostrar `http://127.0.0.1:3002`. Déjalo abierto.

4. En Chrome: **Extensiones** → **Cargar descomprimida** → carpeta `src/clients/chrome`.

5. Abre el popup desde la barra de herramientas. Detén `pnpm chrome` y `pnpm server` con **Ctrl+C** cuando termines.

## Pantallas

1. Lista: crear usuario, buscar por id, lista clickeable.
2. Ficha: datos, editar, eliminar, volver.

Los mensajes de error son los de `src/logic/` (inglés).

## Spec

- `docs/specs/chrome-user-extension/`
- Issue: [#971](https://github.com/venturars/neoland-102026/issues/971)
