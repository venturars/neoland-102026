# Plan — alinear el código con las guías

Issue: #473.

No es funcionalidad nueva. Sin SQL nuevo, sin paquete nuevo y sin
mensaje nuevo de `docs/ERRORS.md`. El resultado de cada función sigue
igual. Cada acción pasa a su propia línea, con su nombre, como en
`docs/STYLE.md`. Prettier no junta dos sentencias.

## Ficheros

No se crean ficheros. Se tocan:

- `logic/create-user.js`
- `logic/update-user.js`
- `logic/users-gender-count.js`
- `queries/users.js`
- `db/connection.js`

No se tocan `logic/list-users.js` ni `logic/delete-user.js`: cada línea
ya es una llamada o una comprobación. No se tocan `.sql`, `clients/`,
`eslint.config.js`, `package.json` ni las guías.

## Forma

`createUser(input)`, `updateUser(input)` y `usersGenderCount()` siguen
con la misma firma y la misma salida. Nombre y email: `raw` → `trim` →
(email) `toLowerCase`, cada uno en su línea. La validez del email y el
tope de 64 van en `if` separados, como en first-app
`align-code-with-guides`. En update, solo `undefined` conserva el valor
guardado; el dueño del email se comprueba sin juntar dos condiciones.

En el conteo por género, no se lee `choice.message` si no hay `choice`;
`JSON.parse` y `.genders` van en líneas distintas; `Array.isArray` y la
longitud no comparten `if`. `MODEL`, lote de 6 y la llamada a la IA no
cambian.

En `queries/users.js` se quitan `readSql`, `today` y `toUser`. Cada
lectura de SQL y cada `prepare` + método quedan en líneas con nombre.
Las firmas y los `?` del SQL no cambian. El `CREATE TABLE` al cargar el
módulo sigue igual.

`db/connection.js` abre `users.sqlite` al lado del fichero, con una
acción por línea, y sigue exportando `db`.

## Decisión

Se sigue el camino A. `logic/` sigue importando `queries/` (no se
inyecta el almacén). El SQL sigue con `?`. Las firmas siguen con
`input`. Las guías no se editan en este desarrollo.
