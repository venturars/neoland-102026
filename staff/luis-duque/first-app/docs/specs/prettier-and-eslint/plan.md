# Plan — formato y revisión del código

Cumple `docs/specs/prettier-and-eslint/spec.md`.

No hay función nueva, ni SQL, ni cliente. Las operaciones de los usuarios siguen igual.

## Ficheros

Se toca `package.json`. Los scripts nuevos son:

- `format`: lanza Prettier y da formato al JavaScript de `db`, `queries` y `logic`.
- `lint`: lanza ESLint y revisa errores de código y de compilación.

pnpm añade, como `devDependencies`, `prettier` `3.9.10`, `eslint` `10.13.0` y `@eslint/js` `10.0.1`. `pnpm-lock.yaml` lo escribe pnpm. No se edita a mano. No se usa npm ni yarn.

Se crea `eslint.config.js`. Usa la configuración recomendada de `@eslint/js` sobre los `.js`. Ignora `node_modules` y `.venv`. No hay fichero de configuración de Prettier: vale el formato por defecto.

Se toca `AGENTS.MD`. No existe el apartado «Al terminar una tarea». Se crea al final. Dice que, al terminar una tarea, se lanzan `pnpm format` y `pnpm lint` desde `first-app`.

Se toca `docs/TREE.md`. El árbol incluye `eslint.config.js`.

No se tocan `logic`, `queries`, `db` ni `clients`. No se toca `docs/CONSTITUTIONS.MD`. No se toca el `AGENTS.md` de la raíz del repositorio.

## Validación Socket

El MCP `socket-mcp` no está disponible en esta sesión. No se ha podido mirar campaña, alerta ni stats.

Eso no es ausencia de avisos. Quedan sin comprobar, en la capa 0:

- `prettier` `3.9.10`
- `eslint` `10.13.0`
- `@eslint/js` `10.0.1`

Las dependencias de esos paquetes, hasta 3 capas, tampoco se han comprobado.

No hay alertas que comentar, porque la comprobación no se ha podido hacer. Quien acepta el plan decide si sigue sin esa comprobación.
