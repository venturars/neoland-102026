# Tareas — Reorganizar los documentos SDD

Issue: #754.

Estado: implementado y comprobado en local, tras la autorización expresa. Pendiente de commit.

## 1. [x] Llevar las funciones de negocio al estilo

Abrir `docs/STYLE.md` y añadir el apartado de funciones de negocio.
Comprobar que conserva la firma, los pasos, la actualización parcial y la respuesta.

## 2. [x] Reescribir el manual de trabajo

Reescribir `AGENTS.md` con el SDD obligatorio para cualquier cambio, el apartado de paquetes y la tabla de cierre.
Comprobar que conserva las reglas de Socket de la issue #651.

## 3. [x] Reducir la constitución

Reescribir `docs/CONSTITUTION.md` con sus seis apartados y los enlaces a las guías.
Comprobar con la tabla del plan que ninguna regla anterior se pierde.

## 4. [x] Ajustar los agentes de Git

Editar `agents/git-workflow-agent.md` y `agents/create-pr.md`.
Comprobar que el paso de empezar remite al SDD y que una pull request existente conserva su estado.

## 5. [x] Actualizar arquitectura y árbol

Editar `docs/ARCHITECTURE.md` y `docs/TREE.md`.
Comprobar que `docs/` no tiene documentos nuevos y que esta spec y `socket-mcp-reference` aparecen en el árbol.

## 6. [x] Comprobar

Revisar los enlaces entre documentos y aplicar `pnpm format` a los archivos de la tarea.
Comprobar con `git status` que no hay cambios ajenos.
