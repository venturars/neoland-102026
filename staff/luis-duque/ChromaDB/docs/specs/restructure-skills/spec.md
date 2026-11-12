# Spec · La skill de la documentación en su carpeta

Issue #551.

La skill que consulta la documentación de Python está en `SKILL.md`, en la raíz de `exercises/ChromaDB`. Delante del frontmatter hay una nota de adaptación. El `name` es `python-3-15-docs`, y ese nombre fija una versión. `agents/developer.md` manda leer ese fichero desde la primera línea `---`.

La skill sigue siendo una. Sirve para consultar la documentación de la versión descargada antes de escribir Python. `search.py` y `get_doc.py` son dos pasos de ese mismo flujo.

## Qué hay que hacer

La skill pasa a `skills/python-docs/SKILL.md`.

- El fichero empieza en `---` y es un `SKILL.md` válido. El `name` es `python-docs`.
- El flujo no cambia: buscar por significado, confirmar por nombre exacto, citar la fuente, y las secciones de `search.py`, `get_doc.py`, cómo leer la salida y las reglas.
- `agents/developer.md` apunta a `skills/python-docs/SKILL.md`.
- El `README.md` nombra esa ruta y el nombre `python-docs`. Ahí queda la nota de cómo copiar la carpeta a `.cursor/skills/python-docs/`. El nombre de la carpeta tiene que coincidir con el `name`.
- `exercises/ChromaDB/SKILL.md` se borra.
- `skills/python-docs/SKILL.md` entra en git. El HTML descargado sigue fuera: la regla `python-docs/` del `.gitignore` vale para la carpeta de la raíz del proyecto, no para `skills/python-docs/`.

## Comprobaciones

1. `exercises/ChromaDB/skills/python-docs/SKILL.md` existe, la primera línea es `---` y el `name` es `python-docs`.
2. Ese fichero sigue describiendo el flujo de consulta: buscar por significado, confirmar por nombre, citar `page#anchor`, y los comandos `search.py` y `get_doc.py`.
3. `agents/developer.md` dice que, antes de escribir Python, se siga `skills/python-docs/SKILL.md`.
4. El `README.md` nombra `skills/python-docs/SKILL.md` y `python-docs`, y explica cómo copiar la carpeta a `.cursor/skills/python-docs/`.
5. `exercises/ChromaDB/SKILL.md` no está.
6. `skills/python-docs/SKILL.md` no está ignorado por git. `python-docs/` en la raíz de `exercises/ChromaDB` sigue ignorado.

## Fuera de alcance

- Partir la skill en una por script, o añadir una carpeta `references/`.
- Cambiar los scripts de consulta, el índice o el CRUD de usuarios.
- Tocar `src/core` o `src/sdk`.
