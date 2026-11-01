# Plan — buscar usuarios por nombre

Añadir `findUserByName(name)` en logic, `findByName(name)` en queries/users.js y `queries/queries/find-by-name.sql`: SELECT * FROM users WHERE name = :name ORDER BY id.

Validar texto y nombre recortado antes de consultar. Devolver los cinco campos públicos de cada usuario. Usar Error ordinario y conservar la causa del fallo técnico. Añadir cliente de terminal y script de package.json; el notebook utiliza la misma operación.

Comprobar dos usuarios con el mismo nombre, espacios exteriores, mayúsculas, ausencia, valores inválidos y fallo técnico en una copia temporal.
