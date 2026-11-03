# Cliente de navegador (SSR)

Frontend vanilla de first-app: HTML generado en Node, formularios y enlaces. No usa `/api/*` ni `fetch`.

## Iniciar el frontend

1. **Carpeta de trabajo:** raíz de first-app (donde está `package.json`):

   ```text
   staff/jose-miguel/first-app
   ```

2. **Arrancar el servidor** (PowerShell, CMD o terminal Linux):

   ```text
   node src/clients/browser/start-browser-server.js
   ```

   Debe aparecer en consola:

   ```text
   First App (browser): http://127.0.0.1:3000
   ```

3. **Abrir el navegador** en:

   ```text
   http://127.0.0.1:3000
   ```

4. **Detener:** en la misma terminal, **Ctrl+C**.

El script ajusta el directorio de trabajo a first-app y usa la misma base `src/db/users.sqlite` que terminal y Jupyter. **No** hay entrada en `package.json` (`pnpm start` no aplica a este cliente).

### Si algo falla

| Síntoma | Qué hacer |
| --- | --- |
| Puerto en uso | Cierra otra instancia del cliente o cualquier proceso en el puerto 3000. |
| Lista vacía | Crea usuarios antes con un `.txt` de terminal o un cuaderno Jupyter. |
| `node` no encontrado | Usa la misma instalación de Node con la que ejecutas `pnpm jupyter`. |

## Requisitos

- Usuarios ya guardados en la base local. Este cliente no crea usuarios.
- Solo escucha en **127.0.0.1** (máquina local).

## Pantallas

1. Selección por id (sin contraseña).
2. Menú: volver, modificar, «Ir a notas» deshabilitada.
3. Edición: guardar, volver sin guardar, eliminar con confirmación.

## Más documentación

- Spec, plan y tareas: `docs/specs/browser-user-client/`
- Issue: [#779](https://github.com/venturars/neoland-102026/issues/779)
