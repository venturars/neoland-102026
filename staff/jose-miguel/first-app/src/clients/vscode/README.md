# Cliente VS Code (panel lateral)

Extensión de desarrollo que importa `src/logic/` desde el extension host. Requiere el servidor SQL en marcha (`pnpm server`, puerto 3000).

## Arranque

Ver [`docs/STARTUP.md`](../../../docs/STARTUP.md).

1. Terminal en la raíz de first-app (`staff/jose-miguel/first-app`):

   ```text
   pnpm server
   ```

   Debe mostrar `http://127.0.0.1:3000`. Déjalo abierto.

2. Abre en VS Code la carpeta **`src/clients/vscode`** (esta carpeta, no la raíz de first-app).

3. Pulsa **F5** (Run Extension). En la ventana *Extension Development Host*, abre el icono **First App** en la barra de actividad o ejecuta **First App: abrir panel de usuarios** desde la paleta.

4. Cierra la ventana de desarrollo y detén `pnpm server` con **Ctrl+C** cuando termines.

## Comportamiento

- Lista ordenada por id, alta, búsqueda por nombre / email / id, ficha con edición y borrado con confirmación de email.
- Errores de negocio en inglés; etiquetas y vacíos en español.

## Spec

- `docs/specs/vscode-sidebar-users/`
- Issue: [#986](https://github.com/venturars/neoland-102026/issues/986)
