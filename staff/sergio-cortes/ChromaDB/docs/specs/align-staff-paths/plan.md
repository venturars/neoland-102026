# Plan · Rutas de documentación en la copia staff

Spec: [spec.md](spec.md). Issue #559.

Solo documentación y la skill bajo `staff/sergio-cortes/ChromaDB/`. No hay código nuevo ni tests. Las comprobaciones son búsqueda en ficheros y lectura de los seis markdown listados.

## Ficheros

Rutas desde `staff/sergio-cortes/ChromaDB/`.

| Fichero | Cambio |
| --- | --- |
| `AGENTS.md` | Alcance del developer y sección Comandos: `exercises/ChromaDB` → `staff/sergio-cortes/ChromaDB`. |
| `README.md` | Texto introductorio, bloques `cd`, ChromaDash y Jupyter: misma sustitución. |
| `agents/developer.md` | Carpeta editable para el developer. |
| `skills/python-docs/SKILL.md` | README link, definición de `PY` y ejemplos de `search.py` / `get_doc.py`. Mantener «Run from repository root» si no se hace el refactor a cwd del proyecto. |
| `docs/specs/restructure-skills/spec.md` | Rutas en descripción y lista de comprobaciones. |
| `docs/specs/restructure-skills/plan.md` | Rutas en encabezado de ficheros y tabla de comprobaciones. |

## Decisiones

- Sustitución mecánica de la cadena `exercises/ChromaDB` por `staff/sergio-cortes/ChromaDB` en esos ficheros.
- El ejercicio compartido no se modifica; cada miembro de staff mantiene su propio prefijo bajo `staff/<usuario>/ChromaDB`.
- Commit separado del que añade el árbol copiado, para revisar solo la alineación de rutas.

## Comprobaciones (spec)

| # | Cómo |
| --- | --- |
| 1 | Desde la raíz del repo: `rg 'exercises/ChromaDB' staff/sergio-cortes/ChromaDB` |
| 2–5 | Revisar los seis ficheros según la spec |
