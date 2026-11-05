# Tareas de frontend, Express y workflow

Issue: #855. La rama parte de `staging` `6dac53e1`; PR #856 abierta en borrador. Diego autorizó la entrega completa en una sola PR.

- [x] **F-T01:** Revisar `staging`, Ventura, compañeros y la plantilla vigente; identificar el contrato propio y la ampliación de frontend.
- [x] **F-T02:** Crear issue, rama nueva, commit vacío y PR draft únicos; enlazar #855 desde el orquestador.
- [x] **F-T03:** Resolver `express@5.3.0` en copia temporal y revisar 54 paquetes de niveles 0–3 con Socket, documentando cobertura y límites.
- [x] **F-T04:** Incorporar Express y lockfile sin alterar SQLite ni las operaciones de logic.
- [x] **F-T05:** Migrar las rutas actuales de usuarios, notas y archivos públicos al transporte Express; añadir alta de usuario y traducir errores HTTP.
- [x] **F-T06:** Completar la interfaz vanilla con alta de usuario y mejorar diseño, estados y navegación existentes.
- [x] **F-T07:** Incorporar la colección Postman y ejecutar CRUD y casos de error en una copia aislada.
- [x] **F-T08:** Adaptar las novedades del workflow compartido, conservando los scripts seguros y la delegación real.
- [x] **F-T09:** Recorrer navegador a 390 px, validar datos persistidos, notas, cancelaciones, errores y texto como texto.
- [x] **F-T10:** Verificar scripts Git en repositorios temporales, sintaxis, UTF-8, enlaces, documentación, TREE y diff.
- [x] **F-T11:** Publicar el commit de trabajo y actualizar la PR draft con la evidencia real, sin merge ni revisores.

## Evidencia inicial

Se comprobó que las PR #776, #781, #787 y #792 ya están integradas en `staging`. La PR #856 se abrió en borrador y se enlazó con la issue #855. En la copia temporal `.venv/express-855-review/`, pnpm 11.25.0 resolvió 54 versiones de Express hasta nivel 3. Socket respondió con la organización Free, 54 puntuaciones, 245 alertas abiertas y `403 threat_feed_not_entitled` para campañas. No se ha ejecutado todavía Postman ni cambiado el código de la aplicación en esta iteración.

## Evidencia de implementación · 2026-11-04

- `express@5.3.0` fijado en `package.json` y lockfile. El código de `src/logic/`, `src/queries/`, la preparación de tablas y la base personal no se editaron.
- Copia `.venv/check855/src/` creada sin archivos SQLite personales; `initializeDatabase()` preparó su base. Postman CLI oficial 1.85.0 ejecutó la colección local: 8 solicitudes, 8 scripts de comprobación y 8 aserciones, sin fallos. La CLI avisó que no hay sesión para publicar resultados en Postman Cloud; la ejecución local terminó con estado 0.
- En la misma copia, las rutas de notas dieron 201/200/200/200 para alta, listado, consulta y cambio. Se observaron 400 para JSON roto, 415 para tipo incorrecto, 405 para método no admitido, 404 para ruta privada y 413 para cuerpo mayor de 1 MiB. Borrar usuario devolvió 204 y la consulta de su nota pasó a 404.
- En navegador Playwright a 390 × 844 se creó un usuario, se seleccionó, se creó una nota con texto con aspecto de HTML, se cambió el título, se recargó y se comprobó persistencia. No se creó un elemento `script` y no hubo desbordamiento horizontal. Se modificó el usuario; cancelar el diálogo de borrado conservó la pantalla y confirmar el segundo lo eliminó de la lista. La ejecución fue real en Windows; otros sistemas no se comprobaron.
- `node --check` pasó para los módulos JS HTTP y web; la colección JSON se analizó sin errores. El servidor local temporal se cerró tras las pruebas.
- Los siete scripts Git no tienen diferencias respecto a `staging`. El comprobador aislado `.venv/git-template-check-20261104-855-elevated.py` pasó las siete sintaxis Bash y 14 recorridos en repositorios temporales con remoto bare local: ramas, commits, índice ajeno, protección de ramas y force, push y fast-forward. El primer intento dentro del sandbox no pudo iniciar Git Bash por restricción del objeto MSYS; la ejecución autorizada fuera del sandbox pasó.
- La revisión estática confirmó las doce plantillas en seis parejas, ausencia de referencias a módulos HTTP retirados en `src/` y guías activas, UTF-8 estricto en 30 archivos y `git diff --check` limpio. Los enlaces y el árbol se revisaron en los documentos modificados.
