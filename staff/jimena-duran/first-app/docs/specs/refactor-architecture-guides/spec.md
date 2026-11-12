# Refactorización según las guías de arquitectura

Issue: #488.

El código existente de first-app se ajusta a sus guías vigentes sin cambiar
el comportamiento de la aplicación.

## Criterios de aceptación

- Crear, actualizar, eliminar, listar y buscar usuarios conserva los mismos
  resultados y mensajes de error, incluidas las reglas actuales de limpieza
  de datos y las listas vacías.
- El conteo por género conserva sus resultados `women`, `men` y
  `genderUndefined`, y sus errores actuales.
- Se conservan las firmas existentes `createUser(input)` y
  `updateUser(id, changes)`, documentadas en `docs/CONSTITUTIONS.md`.
- El código cumple las reglas aplicables de las guías vigentes. Según
  `docs/STYLE.md`, cada línea hace una sola acción; las llamadas y las
  comprobaciones van separadas, al igual que `if` y `throw new Error`.

## Límites

El alcance se limita a `staff/jimena-duran/first-app/`. Se excluyen nuevas
funcionalidades, paquetes, consultas SQL, mensajes de error y la creación o
eliminación de archivos. La base de datos local no cambia.
