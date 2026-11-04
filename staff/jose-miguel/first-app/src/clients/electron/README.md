# Cliente Electron

Ventana de escritorio que importa `src/logic/` directamente. Requiere el servidor SQL en marcha (`POST /execute` en el puerto 3000).

## Arranque

Ver [`docs/STARTUP.md`](../../../docs/STARTUP.md).

1. Terminal en la raíz de first-app (`staff/jose-miguel/first-app`).

2. Servidor SQL:

   ```text
   pnpm server
   ```

   Debe mostrar `http://127.0.0.1:3000`. Déjalo abierto.

3. Otra terminal:

   ```text
   pnpm electron
   ```

4. Cierra la ventana y detén el servidor con **Ctrl+C** cuando termines.

## Pantallas

1. Lista: crear usuario, buscar por id, lista clickeable.
2. Ficha: datos, editar, eliminar, volver.

Los mensajes de error son los de `src/logic/` (inglés).

## Spec

- `docs/specs/electron-desktop-client/`
- Issue: [#951](https://github.com/venturars/neoland-102026/issues/951)
