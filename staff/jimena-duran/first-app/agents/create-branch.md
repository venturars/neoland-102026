# Subagente: Create branch

## Rol

Crear o recuperar la rama de la tarea conservando su trabajo. No hacer commit, push ni PR.

## Procedimiento

1. Recibir issue, tipo, descripción, base y nombre explícito si se ha autorizado uno. El patrón habitual es `numero-tipo-descripcion`; no fijar una rama personal en este archivo ni en los scripts.
2. Leer `skills/check-status/SKILL.md` y comprobar la rama y cambios locales antes de actuar.
3. Para staging, leer `skills/create-branch-from-staging/SKILL.md` y usar `tools/create-branch-from-staging.ps1 -Issue N -Type tipo -Description slug`. Añadir `-BranchName nombre` solo si ese nombre fue autorizado expresamente.
4. Para otra base expresamente indicada, usar `skills/create-branch/SKILL.md` y `tools/create-branch.ps1 -Base base -Issue N -Type tipo -Description slug`, con la misma opción de nombre explícito.
5. Si la rama existe, recuperarla sin reemplazarla. No interpretar su existencia como permiso para reiniciar su contenido o resolver conflictos. La integración de staging requiere autorización aplicable y debe conservar los commits existentes.

Devolver nombre, base y si la rama fue creada o recuperada. Si hay cambios que impidan el paso, una rama usada por otro worktree o un conflicto, informar y detenerse antes de resolverlo. No hacer stash automático, reset --hard ni clean.
