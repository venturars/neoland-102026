# Plan — misma estructura que la PR, lógica propia

**Estado:** reorganización implementada y comprobada manualmente. Referencia: PR #139, commit
`57af803c149e300e7f1a9bdc6799914a17152297`.

## Alcance

Reproducir los directorios y nombres de archivo de la app de Ventura. Conservar
nuestras reglas de validación, respuestas `{ ok, ... }`, códigos de error,
consultas parametrizadas, fechas UTC y configuración local de Ollama.
No modificar ni copiar la base personal. No añadir tests automatizados.

## Cambios

- Mantener `db/connection.js` idéntico a la PR. `queries/users.js` importa ese
  singleton y ofrece consultas sin recibir la conexión como argumento.
- Integrar la conversión de filas y de conflictos UNIQUE en `queries/users.js`.
  Las reglas de usuario siguen en las operaciones de `logic/`.
- Las operaciones importan directamente las consultas: `createUser(input)`,
  `updateUser(id, changes)`, `deleteUser(id)`, `listUsers()`,
  `findUserByEmail(email)`, `findUserById(id)` y `usersGenderCount()`.
- Integrar las comprobaciones del antiguo validador dentro de cada operación,
  sin cambiar reglas ni precedencia de errores. Quitar los argumentos de
  repositorio y proveedor, porque desaparecen las capas que los conectaban.
- Integrar HTTP nativo, esquema JSON, configuración y conteo dentro de
  `logic/users-gender-count.js`. Mantener lotes de seis, timeout de 120 segundos,
  nombres como únicos datos enviados y ausencia de escrituras.
- Crear los ocho clientes `.txt` de la PR. Contienen JavaScript que los scripts
  pnpm pasan a Node por entrada estándar; funcionan desde PowerShell sin Bash.
  Los ejemplos siguen el estilo de la PR: importación, llamada y console.log,
  sin try/catch/finally ni cierres manuales. Cada ejecución termina su proceso;
  Node muestra directamente los fallos técnicos y sale con código distinto de cero.
- Conservar los comandos `db:init` y `classify`. Añadir comandos por operación:
  `create-user`, `update-user`, `delete-user`, `list-users`,
  `find-user-by-email` y `find-user-by-id`. Retirar las demos agrupadas.
- Consolidar la documentación útil en AGENTS, `docs/CONSTITUTIONS.md` y los tres
  documentos del clasificador. Retirar README y la spec adicional de búsqueda
  por ID, cuyos contratos quedan descritos en la constitución.
- Retirar app.js, el validador independiente, repositorios, servicios, los
  clientes `.js` y los directorios que queden vacíos.

## Reglas que se conservan

Entradas solo con name/email, nombre obligatorio, normalización de correo,
límite de 64 caracteres, unicidad, ID entero positivo seguro, actualizaciones
parciales y eliminación definitiva. Los errores esperados conservan sus códigos;
los fallos técnicos siguen lanzando excepciones. El clasificador conserva
`{ ok: true, women, men, genderUndefined }` y sus reglas de respuesta incompleta.

## Comprobación manual

- Comparar el árbol final con el árbol completo de la PR, excluyendo únicamente
  los archivos generados de node_modules y los auxiliares de SQLite.
- Trabajar con una copia temporal del código sin la base personal.
- Ejecutar los ocho clientes mediante pnpm; repetir la inicialización y observar
  altas, búsquedas, modificación, listado, clasificación y eliminación.
- Observar en terminal los errores de validación, duplicados e inexistentes.
- Ejecutar el clasificador con Ollama real sobre nombres sintéticos y registrar
  los recuentos observados. Comprobar que su suma coincide con los usuarios.
- Comprobar imports, enlaces, UTF-8, sintaxis y ausencia de referencias a archivos
  retirados. Conservar la conexión idéntica a la PR.

## Ajuste de los clientes de terminal

Simplificar los ocho ejemplos al estilo de la referencia, conservando JavaScript
por stdin y los comandos pnpm para PowerShell. No cambiar lógica ni consultas.
El cliente de inicialización mostrará las tablas existentes, como hace la PR.
Comprobar los ocho comandos en una copia temporal y observar el fallo de Node
al ejecutar una consulta sin inicializar la tabla.
