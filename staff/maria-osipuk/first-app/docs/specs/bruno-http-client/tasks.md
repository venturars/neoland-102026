Issue: #1119

# Tareas de la colección de Bruno para el cliente HTTP

1. Crear `src/clients/http/bruno/bruno.json` y `collection.bru` con `baseUrl` y `missingId`. Resultado: Bruno abre la carpeta como colección.
2. Crear `01-sql-online/` con `folder.bru` y las peticiones 01 a 13. Resultado: cada archivo tiene `meta`, método, URL y `tests`.
3. Crear `02-sql-offline/` con `folder.bru` y las peticiones 14 a 18. Resultado: cinco peticiones que esperan `500`.
4. Actualizar `README.md`, `docs/ARCHITECTURE.md` y `docs/TREE.md`. Resultado: la colección y esta spec constan en las tres guías.
5. Comprobar con base temporal: carpeta 01 en verde con el servidor de datos, carpeta 02 en verde sin él. Resultado: 18 peticiones pasan.
6. Ejecutar `pnpm format`, `pnpm lint` y `pnpm test` sobre lo tocado. Resultado: sin errores y sin cambios ajenos.
