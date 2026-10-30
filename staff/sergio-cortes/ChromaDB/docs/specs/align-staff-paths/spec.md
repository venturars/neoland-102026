# Spec · Rutas de documentación en la copia staff

Issue #559.

Esta copia vive en `staff/sergio-cortes/ChromaDB/`. Se creó a partir de `exercises/ChromaDB`. Varios markdown siguen citando `exercises/ChromaDB` en instrucciones de `cd`, alcance de edición del developer, comandos de la skill y comprobaciones de specs heredadas. Esas rutas apuntan al ejercicio compartido, no a este proyecto.

## Qué hay que hacer

Sustituir referencias al ejercicio compartido por la ruta de esta copia cuando el texto hable de **dónde está este proyecto** o **desde dónde se ejecutan comandos**:

- Usar `staff/sergio-cortes/ChromaDB` (con barra final opcional) cuando la audiencia está en la raíz del repositorio del bootcamp.
- No cambiar rutas relativas que ya son internas al proyecto (`scripts/…`, `skills/python-docs/SKILL.md`, `docs/CONSTITUTION.md`) salvo que el párrafo mezcle el prefijo incorrecto `exercises/ChromaDB`.

Ficheros que deben quedar alineados:

- `AGENTS.md`
- `README.md`
- `agents/developer.md`
- `skills/python-docs/SKILL.md`
- `docs/specs/restructure-skills/spec.md`
- `docs/specs/restructure-skills/plan.md`

No se reescribe el significado de la spec #551 en `restructure-skills`; solo las cadenas de ruta que describen ubicaciones bajo este árbol.

## Comprobaciones

1. `rg 'exercises/ChromaDB' staff/sergio-cortes/ChromaDB` no devuelve coincidencias.
2. `AGENTS.md` y `agents/developer.md` limitan la edición del developer a `staff/sergio-cortes/ChromaDB` (salvo `docs/specs/`).
3. `README.md` indica `cd staff/sergio-cortes/ChromaDB` desde la raíz del repositorio y no menciona `exercises/ChromaDB`.
4. `skills/python-docs/SKILL.md` usa `staff/sergio-cortes/ChromaDB` en `PY`, en las rutas de `search.py` / `get_doc.py` y en el enlace al README de este proyecto.
5. Las comprobaciones y rutas en `docs/specs/restructure-skills/spec.md` y `plan.md` usan `staff/sergio-cortes/ChromaDB` donde antes citaban `exercises/ChromaDB`.

## Fuera de alcance

- Cualquier cambio en `exercises/ChromaDB/` o en la raíz del repositorio del bootcamp.
- Refactor de la skill para ejecutar solo con rutas relativas desde la carpeta del proyecto (`.venv/bin/python`, `scripts/search.py`).
- Cambios en código Python, scripts, índice, ChromaDash o CRUD de usuarios.
- Nueva spec distinta de esta para el primer commit de copia del árbol de ficheros; ese trabajo ya está en la rama.
