# Plan — formato y comprobación del código

Configuración. No reemplaza ningún fichero de `logic/`. No guarda datos. No cambia el comportamiento de la app.

El formato ya es el estándar de Prettier, sin configuración propia. Hoy no hay comando para aplicarlo ni comando para comprobar el código. `package.json` no tiene scripts. `docs/style.md` dice lo mismo: no hay script de lint ni de formato, ni fichero de configuración.

`docs/ARCHITECTURE.md` dice que `package.json` tiene el script `jupyter`. Ese script no está. Se corrige esa frase y se nombran `format` y `lint`.

La spec pide dos comandos y meterlos en el cierre de la tarea. La constitución, sección 7, sigue pidiendo el cliente de terminal al crear una funcionalidad. Este cambio no lo quita. No hay un mensaje de `docs/errors.md` para este fallo.

## Ficheros

Se tocan:

- `package.json` — scripts `format` y `lint`
- `AGENTS.md` de first-app — el apartado «Al terminar una tarea» incluye los dos comandos
- `docs/style.md` — los comandos dejan de decir que no hay script de formato ni de lint
- `docs/ARCHITECTURE.md` — `package.json` deja de decir que tiene el script `jupyter` y nombra `format` y `lint`
- un fichero de configuración de ESLint, para que `lint` pueda avisar de errores

No se toca el `AGENTS.md` de la raíz.

No se tocan los `.js`, los `.sql`, los clientes ni las specs ya escritas.

No se crea fichero de configuración de Prettier. El formato sigue siendo el estándar, sin configuración propia.

## Parecido

No hay fichero de `logic/` al que se parezca. No hay firma ni parámetros. No hay SQL nuevo.

## Comandos

`format` lanza Prettier y escribe el formato estándar.

`lint` lanza ESLint.

Las dependencias se instalan con pnpm, porque el proyecto fija versiones en `pnpm-lock.yaml`. Las versiones son Prettier `3.9.10` y ESLint `10.13.0`.

## Errores

Ningún fallo de esta spec usa un mensaje de `docs/errors.md`. El fallo se ve al lanzar el comando: el formato no es el estándar, o la comprobación no avisa del error.

## AGENTS.md

En `## Al terminar una tarea` se mantienen las dos frases del cliente de terminal. Se añaden dos frases:

- Antes de dar la tarea por terminada se lanza `format`. Aplica Prettier con el formato estándar.
- Antes de dar la tarea por terminada se lanza `lint`. ESLint avisa de la sintaxis y de las reglas de código.

## style.md

En `## Comandos`, la línea de ejecutar deja de decir que `package.json` no tiene scripts.

La línea de lint y formato dice que `format` lanza Prettier, sin fichero de configuración, y que `lint` lanza ESLint con su fichero de configuración.

## Decisiones

Se añade el fichero de configuración de ESLint y se actualiza `docs/style.md`.

`docs/ARCHITECTURE.md` se corrige: no tiene el script `jupyter`. Los scripts nuevos son `format` y `lint` en `package.json`, y el cierre queda en «Al terminar una tarea» de `AGENTS.md`.

`format` es Prettier y escribe el formato estándar. `lint` es ESLint: avisa de la sintaxis y de las reglas de código. No hay compilador.

## Socket

El plan añade dos paquetes de Node: Prettier `3.9.10` y ESLint `10.13.0`. El chequeo de puntuación se hizo con el MCP `socket-mcp`.

Prettier `3.9.10`: license 100, maintenance 97, quality 96, supplyChain 98, vulnerability 100. No tiene dependencias. Ninguna stat está por debajo de 50.

ESLint `10.13.0`: license 100, maintenance 95, quality 100, supplyChain 97, vulnerability 100. Ninguna stat está por debajo de 50.

Sus dependencias, hasta 3 capas, son 66 paquetes. En todos, la stat más baja está por encima de 50. La más baja de esa lista es quality 68, en `shebang-command` `2.0.0`.

Las herramientas de campaña y de alertas del mismo MCP siguieron sin autorización después de iniciar sesión. La página pública de alertas de estas dos versiones no mostró ninguna alerta. No hay una alerta que aceptar.
