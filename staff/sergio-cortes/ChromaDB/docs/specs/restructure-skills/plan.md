# Plan · La skill de la documentación en su carpeta

Spec: [spec.md](spec.md). Issue #551.

Este plan dice cómo se cumple la spec. No hay código nuevo, ni dependencia nueva, ni suite de tests. Las comprobaciones son leer los ficheros.

## Ficheros

Rutas desde `staff/sergio-cortes/ChromaDB/`.

| Fichero | Cambio |
| --- | --- |
| `skills/python-docs/SKILL.md` | La skill. Empieza en `---`. El `name` pasa a `python-docs`. El flujo de consulta se copia tal cual. |
| `SKILL.md` | Se borra. |
| `agents/developer.md` | La frase que manda leer la skill apunta a `skills/python-docs/SKILL.md`. |
| `README.md` | Nombra esa ruta y `python-docs`. La nota de copiar la carpeta a `.cursor/skills/python-docs/` se queda aquí. |
| `.gitignore` | `python-docs/` pasa a `/python-docs/`. |

## Decisiones

La skill sigue siendo una. `search.py` y `get_doc.py` se quedan en el mismo fichero. No hay carpeta `references/`.

Del `SKILL.md` actual solo pasa al fichero nuevo lo que empieza en la primera línea `---`. La nota «Adaptación a tu entorno» no entra en la skill que lee el agente: pasa al README, como nota de cómo copiar la carpeta. El nombre de esa carpeta es `python-docs`, igual que el `name`.

En `agents/developer.md` la ruta es `skills/python-docs/SKILL.md`, relativa a `staff/sergio-cortes/ChromaDB/`, igual que `docs/CONSTITUTION.md` en ese mismo fichero.

`.gitignore` tiene `python-docs/` sin barra delante. Esa regla ignora cualquier carpeta con ese nombre, también `skills/python-docs/`. Con `/python-docs/` solo queda fuera el HTML descargado, en la raíz del proyecto. `python-docs-md/`, `chroma_db/` y `.venv/` no se tocan.

## Comprobación de la constitución

| Condición | Cómo |
| --- | --- |
| El agente consulta con scripts de terminal, no con un MCP | Los comandos de la skill siguen siendo `search.py` y `get_doc.py`. |
| `python-docs/`, `python-docs-md/`, `chroma_db/` y `.venv/` no van a git | `/python-docs/` deja fuera el HTML de la raíz. Las otras tres reglas no cambian. |
| No se añade una dependencia | `requirements.txt` no se toca. |

El estilo de código no entra: no se edita ningún `.py`.

`src/core` y `src/sdk` no se crean ni se modifican. El ciclo no llama al tester por este cambio.

## Qué mirar

| Comprobación de la spec | Dónde |
| --- | --- |
| 1 | Primera línea y `name` de `skills/python-docs/SKILL.md` |
| 2 | Mismas secciones de consulta en ese fichero |
| 3 | `agents/developer.md` |
| 4 | `README.md`, sección «Usarlo desde un agente» y la línea de «Cómo funciona» |
| 5 | `SKILL.md` ausente en la raíz de `staff/sergio-cortes/ChromaDB` |
| 6 | `git check-ignore -v` sobre `skills/python-docs/SKILL.md` (no ignora) y sobre `python-docs/` (sí ignora) |
