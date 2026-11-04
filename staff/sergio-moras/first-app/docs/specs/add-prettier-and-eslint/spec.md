# Spec: Prettier y ESLint

Issue: #700.

## Qué queremos conseguir
Que el código JavaScript de la app tenga siempre el mismo formato, lo escriba quien lo escriba, y que los errores de código se vean sin ejecutarlo. Quien termina una tarea lanza dos comandos: uno formatea y otro revisa.

## Cómo se usa
Desde `first-app/`:
- `pnpm format` deja el JavaScript de la app en el formato estándar de Prettier: comillas dobles, punto y coma, coma final, sangría de 2 espacios y ancho de 80. No hay configuración propia de formato.
- `pnpm lint` revisa el código con las reglas recomendadas de ESLint. Si hay un error, lo muestra con el fichero y la línea. Si no hay ninguno, no muestra nada.

## Ejemplo
Se termina una tarea. `pnpm format` cambia `'../queries/users.js'` por `"../queries/users.js"` y añade los punto y coma que falten. `pnpm lint` no muestra ningún error.

## Reglas de negocio
- Se formatean los `.js` de `logic/`, `queries/` y `db/`, y `eslint.config.js`.
- Al terminar una tarea se lanzan `pnpm format` y `pnpm lint`, y `pnpm lint` no da errores.
- Los paquetes se validan con Socket antes de aceptar el plan.
- Lo que hace la app no cambia: crear, buscar, listar, actualizar, borrar y clasificar usuarios dan el mismo resultado y los mismos mensajes.

## Casos a cubrir
- `pnpm format` cambia los ficheros que no siguen el formato y deja igual los que ya lo siguen.
- `pnpm lint` sin errores sobre el código de la app.
- Los comandos de `clients/terminal/` dan la misma salida que antes.

## Fuera de alcance
- El JavaScript que va dentro de los `.txt` de `clients/terminal/` y de los `.ipynb` de `clients/jupyter/`: ni Prettier ni ESLint lo leen.
- Los `.md`, `.json`, `.sh` y el lockfile.
- Una configuración propia de Prettier.
- Reescribir el código para dejar una acción por línea, cambiar nombres o mover carpetas.
