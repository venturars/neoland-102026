# Plan — capas dentro de src

Issue: #663. Aplican la [constitución](../../CONSTITUTIONS.md) y el [estilo](../../STYLE.md).

## Implementación

- Mover `db/`, `clients/`, `logic/` y `queries/` a `src/` conservando los bytes de módulos JavaScript y SQL. La base local y sus auxiliares acompañan a `db/`; sus hashes se comparan antes y después sin abrirla para pruebas.
- Actualizar las rutas de los scripts de package.json a `src/clients/terminal/`. Conservar packageManager, versiones y lockfile.
- Adaptar los imports de clientes a `./src/logic/` y `./src/queries/` porque Node sigue ejecutándose desde la raíz de first-app.
- En cada notebook, buscar hacia arriba una raíz con package.json y src/logic, usarla como cwd de Node y ajustar el enlace a las guías con un nivel adicional. Conservar todas las llamadas a las operaciones.
- Cambiar solo el destino de Notebook en `scripts/jupyter.sh` y las exclusiones específicas de la base en `.gitignore`.
- El agente principal coordina las guías compartidas: AGENTS, constitución, arquitectura, árbol, datos y referencias activas. Este bloque no edita esos archivos concurrentemente.

## Comprobación

Registrar hashes de módulos y base local antes del traslado. Comprobar sintaxis, nueve notebooks, imports y contratos en una copia temporal nueva dentro de `.venv`, sin copiar la base personal. Preparar allí una base nueva y ejecutar los clientes y escenarios CRUD/búsquedas/clasificador; los resultados controlados se distinguen de Ollama real.

La versión de pnpm declarada se utilizará para la instalación offline de la copia si es necesaria; no copiar enlaces de node_modules que apunten mal ni cambiar el lockfile. Comprobar arranque Jupyter en Windows mediante un puerto local separado y cerrarlo al terminar. Linux y macOS se mantienen como no ejecutados si no están disponibles.

## Constitución

Se mantiene una operación por fichero, consultas parametrizadas, conexión única por proceso y preparación explícita de tablas. Siguen las mismas dependencias, errores y nombres; solo cambian rutas. Todos los textos y scripts son UTF-8. La comprobación utiliza datos sintéticos y no abre la base personal. No se crea directorio tests ni se duplica la lógica en clientes.
