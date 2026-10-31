# Tareas 008 · Flujo de trabajo compartido

> Estado: **Implementación comprobada; publicación en curso** · Spec, plan y tareas aprobados: 2026-10-31 · Issue: #692 · Pull request: #693

Referencias: [spec.md](spec.md) y [plan.md](plan.md). Estas tareas se ejecutan después de aprobar esta lista, en orden y una responsabilidad cada vez. Una casilla se marca solo cuando su resultado se ha comprobado.

Las rutas de archivos de este documento son relativas a AsistenciApp. La fuente compartida indicada en el plan es relativa a la raíz del repositorio. Las constituciones, los archivos del producto y las especificaciones anteriores quedan fuera de los cambios.

---

## Comprobación previa

- [x] **T01 · Comprobar la fuente compartida y el alcance.** Confirmar que los 42 archivos locales del template coinciden con la versión compartida vigente y revisar el estado de los documentos de esta tarea. Si cambia el inventario o una decisión del plan, actualizar el plan y obtener su aprobación antes de copiar. **Cubre:** CA-03 y CA-10.

---

## Incorporación del flujo

- [x] **T02 · Incorporar los siete scripts.** Copiar `tools/` desde la fuente compartida, conservando su contenido y los permisos de ejecución. Comprobar la igualdad de contenido y permisos de los siete archivos. **Cubre:** CA-03.
- [x] **T03 · Incorporar los siete agentes.** Copiar `agents/` sin alterar sus responsabilidades ni sus instrucciones. Comprobar que el inventario y el contenido coinciden con la fuente. **Cubre:** CA-01, CA-03 y CA-04.
- [x] **T04 · Incorporar las quince skills.** Copiar `skills/` con sus argumentos, límites y tratamiento de errores actuales. Comprobar que incluye las versiones actualizadas de creación de issues y PR, asignación de revisores y enlace con la issue. **Cubre:** CA-02, CA-03, CA-04 y CA-09.
- [x] **T05 · Adaptar los siete comandos de terminal.** Ajustar únicamente el prefijo de los comandos de `check-status`, `pull-changes`, `create-branch`, `create-branch-from-staging`, `create-empty-commit`, `commit-changes` y `launch-push`. Resolver sus rutas desde la raíz del repositorio y comprobar que cada script existe y es ejecutable. **Cubre:** CA-03 y CA-08.
- [x] **T06 · Incorporar las doce plantillas por tipo.** Copiar las seis plantillas de issues y las seis de PR. Comprobar que no aparecen las dos básicas obsoletas y que los comentarios de título y la línea de cierre coinciden con la fuente. **Cubre:** CA-02 y CA-04.
- [x] **T07 · Incorporar la guía MCP.** Copiar `MCPS/github-mcp-server/mcp.txt` y comprobar el header y el marcador del ejemplo. Mantener las credenciales y la configuración externa fuera de los cambios. **Cubre:** CA-09.

---

## Documentos de trabajo

- [x] **T08 · Actualizar `AGENTS.md`.** Sustituir las referencias obsoletas del flujo Git por el orquestador local y los recursos incorporados. Comprobar la jerarquía de fuentes, las aprobaciones separadas de spec, plan y tareas, el alcance local y la conservación de las reglas educativas; usar roles generales. **Cubre:** CA-01, CA-05, CA-06, CA-07 y CA-08.
- [x] **T09 · Actualizar `docs/ARCHITECTURE.md`.** Añadir las cinco carpetas del flujo de desarrollo y sus responsabilidades. Comprobar que se conserva el recorrido de asistencia y la sección de incidencias pendientes, sin crear un documento de árbol adicional. **Cubre:** CA-07 y CA-10.
- [x] **T10 · Actualizar `README.md`.** Añadir los enlaces de desarrollo al manual, al orquestador, a las plantillas y a la guía MCP, junto con el contexto de ejecución de los scripts y las aprobaciones. Resolver los enlaces nuevos y comprobar que se conservan las instrucciones de preparación, uso y cierre de la aplicación. **Cubre:** CA-07, CA-08 y CA-09.

---

## Comprobaciones finales

- [x] **T11 · Comparar los recursos y las referencias.** Comprobar automáticamente los 42 archivos: 35 idénticos y siete skills con el único ajuste del comando; resolver las referencias internas y los enlaces nuevos. Revisar las siete filas de la comparación del template y la redacción general, sin apartados ligados a ramas o commits concretos. **Cubre:** CA-02, CA-03, CA-07, CA-08 y CA-09.
- [x] **T12 · Comprobar los scripts sin modificar el trabajo.** Ejecutar la comprobación de sintaxis de los siete scripts y el script de estado desde la raíz. Comprobar entradas inválidas de los dos scripts de ramas que se rechacen antes de acceder al remoto, y verificar que no cambian la rama, el índice ni los archivos. **Cubre:** CA-03 y CA-08.
- [x] **T13 · Comprobar la issue y la PR existentes.** Consultar la asignación, los estados abiertos, el borrador, la base, la apertura de la rama, el commit vacío, una única línea `Closes #N` y Development. Consultar la rama por defecto y registrar el resultado, sin crear demostraciones remotas, cerrar la issue ni fusionar la PR. **Cubre:** CA-01 y CA-04.
- [x] **T14 · Ejecutar las pruebas de la aplicación.** Ejecutar pytest con el entorno virtual existente y datos temporales. Registrar el resultado real; comprobar que el código del producto, los tests, las dependencias y la constitución permanecen sin cambios. **Cubre:** CA-10.
- [ ] **T15 · Registrar el resultado y publicar el trabajo comprobado.** Completar la tabla de criterios y las limitaciones, revisar `git diff --check` y actualizar los estados de la spec, el plan y las tareas según lo realizado. Publicar solo los archivos de esta tarea en la PR existente y mantener la aprobación final como pendiente cuando corresponda. **Cubre:** CA-05, CA-06, CA-09 y CA-10.

---

## Registro de comprobaciones

Resultados de la implementación y sus comprobaciones. La publicación y el cierre documental se registran al completar T15.

| Criterio | Resultado | Evidencia o límite |
| --- | --- | --- |
| CA-01 | Comprobado | Issue y PR abiertas y asignadas; PR en borrador, con apertura de rama y commit vacío comprobados desde la base compartida. |
| CA-02 | Comprobado | Doce plantillas idénticas; títulos definidos en sus comentarios y tipos de rama sin la validación fija antigua. |
| CA-03 | Comprobado | 42 archivos: 35 idénticos y siete comandos adaptados; siete scripts ejecutables y 56 referencias internas resueltas. |
| CA-04 | Comprobado | Una línea `Closes #N`, enlace Development y cierre automático asociado; la issue permanece abierta y la rama por defecto consultada es `staging`. |
| CA-05 | Comprobado | Spec, plan y tareas aprobados por separado; el orden y las aprobaciones permanecen en el manual y el README. |
| CA-06 | Comprobado | Constitución v3.0 intacta; fuentes de verdad, alcance local y reglas educativas conservados. |
| CA-07 | Comprobado | 22 enlaces locales resueltos; referencias obsoletas del flujo retiradas y documentación conectada con los recursos instalados. |
| CA-08 | Comprobado | Redacción general revisada y siete rutas ejecutables comprobadas desde la raíz del repositorio; sin apartados de punto de partida concretos. |
| CA-09 | Comprobado | Guía y header idénticos al template; marcador de credenciales conservado. La conexión local de Cursor no se ha ejecutado ni se ha modificado su configuración. |
| CA-10 | Comprobado | 112 pruebas aprobadas; 57 archivos protegidos intactos, incluidos producto, tests, dependencias, constitución y especificaciones anteriores. |

La conexión MCP local de Cursor no se ha probado. Las consultas de metadatos realizadas con otras conexiones no sustituyen esa comprobación. No se ha arrancado una clase ni un túnel. Los fallos de validación pendientes de la arquitectura conservan su alcance separado aunque pytest pase.
