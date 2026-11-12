# Plan — comprobar un paquete con Socket

Cumple `docs/specs/paquetes-socket/spec.md`. Aquí el encaje en first-app.

## Tocar

- `docs/CONSTITUTIONS.md`: una sección «Paquetes». Un paquete de Node nuevo, o un cambio de versión, se comprueba con Socket antes de aprobar el plan. El árbol lista esta spec.
- `AGENTS.md` de esta app: una sección «Paquetes». Dice cuándo se mira, las tres capas, campañas, alertas y puntuación bajo 50, el resumen del plan, la decisión de quien aprueba y lo que queda fuera.

## No tocar

- JavaScript, SQL y los ficheros de paquetes.
- El `AGENTS.md` de la raíz del repo.
- No se añade ningún paquete, así que esta tarea no consulta Socket.
