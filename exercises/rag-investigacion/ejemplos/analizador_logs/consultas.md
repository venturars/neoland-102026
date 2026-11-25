# Analizador concurrente de logs: consultas al RAG

`analizador_logs.py` lee la configuración de un TOML, analiza varios logs a la vez con `asyncio` y un timeout por fichero, y saca las peticiones por código de estado, las rutas más pedidas y la latencia (mediana y p95). Cada decisión de API del código lleva la etiqueta de la consulta que la respalda, por ejemplo `[timeout]`.

Las consultas se hicieron con la configuración final del RAG: nomic, reranker MiniLM y filtro por módulo. `consultas.json` guarda los fragmentos devueltos por las nueve primeras.

```bash
uv run python ejemplos/analizador_logs/generar_datos.py        # regenera datos/
uv run python ejemplos/analizador_logs/analizador_logs.py ejemplos/analizador_logs/datos/config.toml
uv run python ejemplos/analizador_logs/analizador_logs.py ejemplos/analizador_logs/datos/config_rota.toml
uv run python ejemplos/analizador_logs/consultas.py . consultas.json   # repite las consultas
```

## Consultas

| Etiqueta | Pregunta | Filtro | Primer fragmento (score) | ¿Reformulada? | Decisión |
|---|---|---|---|---|---|
| `taskgroup` | How do I run several coroutines concurrently and wait for all of them with asyncio.TaskGroup? | asyncio | `library/asyncio-api-index.md` (5,8) | No | `asyncio.TaskGroup` en lugar de `gather` |
| `taskgroup_error` | What happens to the other tasks when a task in an asyncio.TaskGroup raises an exception? | asyncio | `library/asyncio-task.md` (6,8) | No | El grupo cancela el resto y lanza un `ExceptionGroup`. El timeout se captura dentro de cada tarea, para que un log lento no tumbe a los demás. Un log que no existe sí aborta todo. |
| `timeout` | How do I apply a timeout to a block of code with asyncio.timeout? | asyncio | `library/asyncio-task.md` (6,6), pero era `wait_for` | Sí: «asyncio.timeout context manager example async with» dio `asyncio.timeout` (8,1) | `async with asyncio.timeout(...)` + `except TimeoutError` |
| `to_thread` | How do I run a blocking function in a separate thread from asyncio? | asyncio | `library/asyncio-task.md` (7,0) | No | La lectura del fichero va a otro hilo con `asyncio.to_thread` |
| `tomllib` | How do I read and parse a TOML configuration file? | tomllib | `library/tomllib.md` (5,7) | No | `open(..., "rb")`: `tomllib.load` necesita un fichero binario |
| `except_star` | How do I handle exceptions from an ExceptionGroup with except*? | — | `tutorial/errors.md` (8,0) | No | `except* FileNotFoundError` lista todos los logs que faltan |
| `quantiles` | How do I compute percentiles or quantiles of a list of numbers? | statistics | `library/statistics.md` (6,9) | No | `quantiles(n=100, method="inclusive")`: el log es la población completa |
| `counter` | How do I count occurrences and get the most common elements? | collections | `library/collections.md` (2,8) | Sí: «Counter.most_common(n)…» dio la ficha del método (5,7) | `Counter` + `most_common(n)` |
| `re_named` | How do I use named groups in a regular expression and get them as a dict? | re | `library/re.md` (3,7), sin `groupdict` | Sí: «Match.groupdict…» dio la ficha del método (8,6) | `(?P<name>...)` + `m.groupdict()` |

## Fallos que el RAG no evitó

- **`return` dentro de `except*`.** La primera versión dio `SyntaxError: 'break', 'continue' and 'return' cannot appear in an except* block`. La regla está en `reference/compound_stmts.md`, al final de un fragmento ocupado casi entero por un ejemplo de código, y no salió ni preguntando por ella. El código marca el error y sale después del bloque.
- **El timeout no detiene el hilo.** Con un timeout de 0,5 s, el programa tarda unos 2,3 s. `asyncio.timeout` deja de esperar, pero el hilo de `to_thread` sigue hasta acabar, y `asyncio.run` espera al executor al cerrar (`library/asyncio-runner.md`). Ningún fragmento lo dice junto a `to_thread`. El ejemplo lo deja así a propósito.

Estos dos casos y las reformulaciones dieron los pasos 3, 4, 5 y 8 de la skill `consultar-docs-python`.
