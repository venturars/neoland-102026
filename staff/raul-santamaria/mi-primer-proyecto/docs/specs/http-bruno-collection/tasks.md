# Tareas — colección Bruno en el cliente HTTP

Un paso. Quien lo revisa marca `- [x]`.

- [x] 1. Abrir `package.json`.
  Añade `@usebruno/cli` en `4.3.0` a `devDependencies` y el script `http-bruno` con `bru run src/clients/http/bruno`. El resto no cambia salvo lo del plan.

- [x] 2. En `mi-primer-proyecto`, lanzar `pnpm install` y abrir `pnpm-lock.yaml`.
  `@usebruno/cli` queda en `4.3.0`. El árbol hasta 3 capas coincide con el plan; si no, se para.

- [x] 3. Crear `src/clients/http/bruno/bruno.json` y `src/clients/http/bruno/collection.bru`.
  La colección se llama `mi-primer-proyecto-http` y define `baseUrl` en `http://127.0.0.1:3001`.

- [x] 4. Crear `src/clients/http/bruno/01-happy-path/` con `folder.bru` y un `.bru` por petición del plan.
  Orden: ruta desconocida, crear Ada, listar, ver por id, patch a Ada Lovelace, borrar Ada, listar sin Ada.

- [x] 5. Crear `src/clients/http/bruno/02-validation/` con `folder.bru` y un `.bru` por caso del plan.
  Cubre nombre vacío, email inválido, email duplicado y `GET` / `PATCH` / `DELETE` con id inexistente.

- [x] 6. Abrir `docs/TREE.md`.
  El árbol incluye `clients/http/bruno/` junto a `app.js`, sin cliente HTTP nuevo.

- [x] 7. Abrir `docs/ARCHITECTURE.md`.
  El bullet de `src/clients/http/` menciona la colección en `bruno/` y `pnpm http-bruno`.

- [x] 8. Lanzar `pnpm lint` desde `mi-primer-proyecto`.
  Termina bien; `app.js` no cambia.

- [x] 9. Con `pnpm server` y `pnpm http` en marcha, lanzar `pnpm http-bruno`.
  La carpeta `01-happy-path` termina con todas las peticiones en verde y el flujo Ada coincide con la spec.

- [x] 10. Sin reiniciar servidores, volver a lanzar `pnpm http-bruno` centrado en `02-validation` o la colección completa según el CLI.
  Cada caso devuelve el HTTP y el `{ message }` de la tabla del plan.
