# Prettier y ESLint en first-app

Issue: #462.

## Qué se pide

La app tiene dos comandos en `package.json`:

- `format`, con Prettier, para dar formato al JavaScript del proyecto.
- `lint`, con ESLint, para revisar errores de código.

Prettier usa la configuración por defecto, como ya dice `docs/STYLE.md`. No hay `.prettierrc`.

Al cerrar un desarrollo, quien trabaja con IA ejecuta esos comandos. Los pasos quedan escritos en `AGENTS.MD`, en **## Al terminar una tarea**.

## Quién lo usa

Quien construye first-app con IA y quien revisa un cambio antes de darlo por terminado.

## Entrada

El código JavaScript de `db/`, `queries/` y `logic/` tal como quedó tras el desarrollo.

## Salida

- Tras `pnpm run format`, el JavaScript de esas carpetas sigue la forma de Prettier por defecto.
- Tras `pnpm run lint`, ESLint termina sin errores sobre el JavaScript del proyecto (salvo avisos que el plan deje explícitos).

Ejemplo: se añade una función en `logic/`. Se ejecuta `pnpm run format` y el fichero queda con comillas dobles e indentación de 2 espacios. Se ejecuta `pnpm run lint` y no aparece ningún error de ESLint.

## Fallo

Si `pnpm run format` o `pnpm run lint` fallan, la tarea no se da por terminada hasta corregir el código o la configuración acordada en el plan.

## Fuera

- Cambiar el script `test` de `package.json`.
- Añadir tests automáticos.
- Formatear cuadernos Jupyter, ficheros `.txt` de terminal o el fichero `db/users.sqlite`.
- Crear `.prettierrc` ni overrides de Prettier.
- Cambiar el comportamiento de las funcionalidades de usuarios que ya existen.
