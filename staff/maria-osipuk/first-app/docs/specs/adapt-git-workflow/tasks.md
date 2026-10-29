# Tareas — Flujo de git del curso

## 1. Copiar los subagentes

Copiar `exercises/git-workflow-agent-template/agents/` a `staff/maria-osipuk/first-app/agents/`.
Son siete ficheros. No se añade ninguno más y el texto no cambia.

## 2. Copiar las skills

Copiar `exercises/git-workflow-agent-template/skills/` a `staff/maria-osipuk/first-app/skills/`.
Son quince carpetas, cada una con su `SKILL.md`. El texto no cambia todavía.

## 3. Copiar los scripts

Copiar `exercises/git-workflow-agent-template/tools/` a `staff/maria-osipuk/first-app/tools/`.
Son siete scripts. Se conserva el permiso de ejecución.

## 4. Copiar las plantillas y el MCP

Copiar `templates/` a `staff/maria-osipuk/first-app/templates/` y `MCPS/` a `staff/maria-osipuk/first-app/MCPS/`.
Son tres ficheros. El texto no cambia.

## 5. Corregir las rutas de las skills

Abrir las siete skills que lanzan un script.
Cada `./tools/` pasa a `staff/maria-osipuk/first-app/tools/`.
El resto de cada skill sigue igual. Las demás skills no cambian.

## 6. Cambiar AGENTS.md

Abrir `AGENTS.md` de `first-app`.
Sustituir la sección «Qué primero» por el texto del apartado «AGENTS.md» del plan.
El resto del fichero sigue igual.

## 7. Corregir la sección de Socket

Abrir `AGENTS.md`, apartado «Validación de paquetes con Socket».
Quitar «el de `MCP.md` en la raíz del repositorio», porque `MCP.md` no existe. Debe quedar «El servidor es `socket-mcp`.»
El resto de la sección sigue igual.

## 8. Actualizar el árbol

Abrir `docs/TREE.md`.
Añadir las cinco carpetas con sus ficheros y la carpeta de esta spec.
El resto del árbol sigue igual.

## 9. Actualizar la arquitectura

Abrir `docs/ARCHITECTURE.md`.
Añadir la sección «Flujo de git» y los puntos de «Ficheros» del apartado «Arquitectura» del plan.
El resto sigue igual. No se repite el árbol.

## 10. Formato y lint

Desde `first-app`, ejecutar `pnpm format` y `pnpm lint`.
Los dos terminan bien.

## 11. Comprobar

Desde la raíz del repositorio, ejecutar `staff/maria-osipuk/first-app/tools/check-status.sh`. Termina bien.
Comprobar que `grep -rn "\./tools/" skills` no devuelve nada.
Comprobar que cada ruta de `AGENTS.md` existe.
Comprobar con `git status` que `logic/`, `queries/`, `db/`, `clients/` y `package.json` no cambian.
Revisar si `docs/CONSTITUTION.md` necesita un cambio e indicarlo al terminar.
