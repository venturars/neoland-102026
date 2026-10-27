# Arquitectura

La aplicación usa Node.js con módulos ES (`"type": "module"`) y una base SQLite gestionada por `node:sqlite`.

`db/` solo abre la base. El SQL permanece en `queries/queries/`; `queries/users.js` lo lee y lo ejecuta, sin reglas de negocio. Las decisiones de negocio viven en `logic/`. Los clientes de terminal invocan esa capa y muestran su resultado.

`logic/` es el núcleo estable de la aplicación. No se reemplaza por adaptadores, plugins o implementaciones intercambiables, y sus reglas no se trasladan a `queries/` ni a `clients/`. Cada operación tiene su propio archivo; una operación nueva no modifica otro archivo para reutilizarlo.

Los contratos de funciones siguen [STYLE.md](STYLE.md); las salidas y los errores se definen en [ERRORS.md](ERRORS.md).
