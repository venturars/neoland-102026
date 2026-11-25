# Golden set: documentación oficial de Python 3.15

Conjunto de preguntas de evaluación para la Fase 0 de [TAREA_RAG_A_TEMPO.md](TAREA_RAG_A_TEMPO.md). Sirve para medir las decisiones de embeddings, chunk size, k, reranking e hybrid sobre el mismo corpus.

## Corpus

- Origen: <https://docs.python.org/3.15/download.html>, fichero `python-3.15-docs-html.zip` (descargado el 2026-11-16).
- Corpus que se indexa: `data/python-docs-3.15/python-3.15-docs-md-clean/` (508 ficheros Markdown, 9,6 MB), generado con `scripts/html_a_md.py` y `scripts/limpiar_corpus_md.py` (criterios en `TAREA_RAG_A_TEMPO.md`).
- Las rutas de «Fuente» están en formato `.html` y son relativas a esa carpeta, cambiando la extensión a `.md`.

## Cómo se usa

Cada pregunta indica la fuente donde está la respuesta y los datos que la respuesta debe contener. Métricas: hit rate@k, MRR y latencia.

Qué cuenta como acierto depende de cómo se compruebe:

- **Comprobación manual:** la recuperación acierta si entre los k resultados hay un chunk de la fuente indicada que contiene la evidencia.
- **Evaluación automática** (`scripts/comparar_embeddings.py`) con dos criterios:
  - **Por fuente** (`rango_primer_acierto`): acierta si entre los k resultados hay un chunk de la fuente indicada, o de una de ellas en la categoría D. No mira el texto, así que da resultados iguales o mejores que la comprobación manual.
  - **Por evidencia** (`rango_primer_acierto_evidencia`): además, el chunk debe contener al menos una de las subcadenas literales que [golden_set_evidencias.json](golden_set_evidencias.json) lista para esa fuente. Cada subcadena es una forma válida de dar la respuesta; la lista recoge redacciones distintas del mismo dato en el corpus. Es la versión automática de la comprobación manual.

`golden_set_evidencias.json` repite los IDs y las fuentes de este documento con el formato `{ID: {fuente: [subcadena, ...]}}`. `leer_evidencias` rechaza un valor que no sea una lista no vacía de cadenas no vacías. Los tests comprueban que IDs y fuentes coinciden con las tablas y que cada subcadena, por sí sola, cabe entera en algún chunk de 500 caracteres. Al añadir una pregunta A-D o cambiar el tamaño de chunk de la configuración base, hay que actualizar el json. `notebooks/06_comparar_tamano_chunk.ipynb` prueba otros tamaños y solapes con el mismo json y lista, por configuración, las evidencias que el troceo deja partidas.

Columnas de las tablas:

- **ID:** identificador estable. No se renumera al añadir preguntas.
- **Query (EN):** pregunta que se lanza contra el índice. Va en inglés, como el corpus: la recuperación trabaja solo en inglés y el agente traduce la respuesta al español.
- **Respuesta esperada:** en español, porque es lo que debe contestar el agente al final.
- **Evidencia:** texto o dato concreto que debe aparecer en el chunk recuperado.
- **Fuente** o **Fuentes:** fichero donde está la respuesta, con la ruta descrita en «Corpus». La categoría E no la tiene.

El título de las categorías A, C y D indica el **k mín.**, el k que debería bastar, con el formato «(k mín. N)». `leer_k_minimo` de `scripts/comparar_embeddings.py` lo lee de esos títulos y conserva N como texto («1-2»); `notebooks/08_comparar_numero_k.ipynb` lo pone junto al acierto de cada k para la pregunta 4 de la tarea. Una categoría sin «(k mín. …)» en el título aparece como «sin declarar». El resultado está en la [ficha 4](FICHA_04_NUMERO_K.md).

Todas las respuestas esperadas se han comprobado contra el texto de la documentación descargada.

## A. Consulta puntual (k mín. 1)

Una pregunta, una fuente, un dato. Es el caso «método HTTP GET» de la pregunta 4.

| ID | Query (EN) | Respuesta esperada | Evidencia | Fuente |
|---|---|---|---|---|
| A01 | How do I make an HTTP GET request with the standard library? | Con `http.client.HTTPSConnection(host)`, `conn.request("GET", "/3/", headers={"Host": host})` y `conn.getresponse()`. | Ejemplo «to perform a GET request to https://docs.python.org/3/» con `print(response.status, response.reason)` → `200 OK` | `library/http.client.html` |
| A02 | How do I open a URL and read the response with `urllib`? | Con `urllib.request.urlopen(url, data=None, [timeout, ]*, context=None)`. `url` puede ser una cadena o un objeto `Request`. | Firma de `urlopen` y su descripción | `library/urllib.request.html` |
| A03 | How do I read a text file with `pathlib`? | `Path.read_text(encoding=None, errors=None, newline=None)` devuelve el contenido decodificado como cadena. | Firma de `Path.read_text` y el ejemplo con `write_text` | `library/pathlib.html` |
| A04 | How do I check that an entire string matches a regular expression? | Con `re.fullmatch(pattern, string, flags=0)`: devuelve un `Match` si toda la cadena coincide y `None` si no. | Descripción de `re.fullmatch` | `library/re.html` |
| A05 | How do I iterate over two lists in parallel and fail if they have different lengths? | `zip(*iterables, strict=False)` con `strict=True`. | Texto «it's recommended to use the strict=True option» | `builtins/functions.html` |
| A06 | How do I sort the keys and indent the output when serializing JSON? | `json.dumps(obj, sort_keys=True, indent=4)`. | Ejemplo `json.dumps({'6': 7, '4': 5}, sort_keys=True, indent=4)` | `library/json.html` |
| A07 | How do I capture the output of an external command with `subprocess.run`? | Con `capture_output=True`: stdout y stderr se capturan con `PIPE`. No se puede combinar con los argumentos `stdout` ni `stderr`. | Párrafo «If capture_output is true, stdout and stderr will be captured» | `library/subprocess.html` |
| A08 | How do I insert multiple rows at once in SQLite? | `cur.executemany("INSERT INTO movie VALUES(?, ?, ?)", data)` seguido de `con.commit()`. Siempre con marcadores `?`, nunca formateando cadenas. | Ejemplo de `executemany` y nota sobre placeholders | `library/sqlite3.html` |
| A09 | How do I create a virtual environment and activate it on macOS or Linux? | `python -m venv tutorial-env` y `source tutorial-env/bin/activate`. En Windows, `tutorial-env\Scripts\activate`. | Comandos de activación | `tutorial/venv.html` |
| A10 | How do I create subcommands in `argparse`? | Con `ArgumentParser.add_subparsers(...)`. | Entrada `ArgumentParser.add_subparsers` con sus parámetros (`title`, `dest`, `required`…) | `library/argparse.html` |

## B. Términos exactos y siglas (para la pregunta 6: hybrid)

Preguntas donde un nombre, un código o una sigla concreta decide la respuesta. La búsqueda semántica pura puede confundirlos con términos parecidos.

| ID | Query (EN) | Respuesta esperada | Evidencia | Fuente |
|---|---|---|---|---|
| B01 | What does HTTP status code 418 mean in `http.HTTPStatus`? | `IM_A_TEAPOT`, definido en HTCPCP/1.0, RFC 2324, sección 2.3.2. | Fila `418 / IM_A_TEAPOT / HTCPCP/1.0 RFC 2324` | `library/http.html` |
| B02 | What does `secrets.compare_digest` do? | Compara dos cadenas o bytes en tiempo constante para reducir el riesgo de ataques de temporización. Ver `hmac.compare_digest()`. | Definición «constant-time compare» | `library/secrets.html` |
| B03 | Where are the `adler32` and `crc32` hash functions? | En el módulo `zlib`, no en `hashlib`. | Nota «adler32 or crc32 hash functions, they are available in the zlib module» | `library/hashlib.html` |
| B04 | Which PEP adds the `frozendict` type in Python 3.15? | PEP 814. | Línea «PEP 814: Add frozendict built-in type» | `whatsnew/3.15.html` |
| B05 | Which PEP makes UTF-8 the default encoding? | PEP 686. | Línea «PEP 686: Python now uses UTF-8 as the default encoding» | `whatsnew/3.15.html` |
| B06 | What is Tachyon and which PEP introduces it? | Un profiler de muestreo estadístico de alta frecuencia, dentro del nuevo paquete `profiling` (PEP 799). | «Tachyon: High-frequency statistical sampling profiler» | `whatsnew/3.15.html` |
| B07 | What is the difference between `functools.cache` and `lru_cache`? | `cache` equivale a `lru_cache(maxsize=None)`: caché sin límite, más pequeña y rápida porque nunca expulsa valores. | Texto «Returns the same as lru_cache(maxsize=None)» | `library/functools.html` |
| B08 | What is the default level of the root logger in `logging`? | `WARNING`. Los loggers nuevos arrancan en `NOTSET`. | Frase «the root logger is created with level WARNING» | `library/logging.html` |
| B09 | What happens if `itertools.batched` gets `strict=True` and the last batch is shorter? | Lanza `ValueError`. | Firma `batched(iterable, n, *, strict=False)` y su descripción | `library/itertools.html` |
| B10 | In which mode must the file passed to `tomllib.load` be opened? | Debe ser un objeto de fichero legible en modo binario. | «readable and binary file object» | `library/tomllib.html` |

## C. Conceptos y comportamiento (k mín. 1-2)

Preguntas de explicación, donde la respuesta ocupa un párrafo o depende de un matiz.

| ID | Query (EN) | Respuesta esperada | Evidencia | Fuente |
|---|---|---|---|---|
| C01 | What is `asyncio.TaskGroup` for and how do I use it? | Es una alternativa moderna a `create_task()`: se usa con `async with asyncio.TaskGroup() as tg` y `tg.create_task(...)`. El `await` es implícito al salir del contexto. | Ejemplo con `say_after` y comentario «The await is implicit when the context manager exits» | `library/asyncio-task.html` |
| C02 | Why doesn't `threading` use multiple cores in CPython, and what is the alternative? | Por el Global Interpreter Lock: solo un hilo ejecuta código Python a la vez. Para usar varios núcleos, `multiprocessing` o `concurrent.futures.ProcessPoolExecutor`. `threading` sigue siendo válido para tareas limitadas por E/S. | Nota «CPython implementation detail: … Global Interpreter Lock» | `library/threading.html` |
| C03 | How do I create an immutable data class with `dataclasses`? | Con `@dataclass(frozen=True)`: asignar a un campo lanza una excepción. | Parámetro `frozen: If true (the default is False), assigning to fields will generate an exception` | `library/dataclasses.html` |
| C04 | Which data structure should I use to implement a queue with fast appends and pops? | `collections.deque`, diseñada para `append` y `pop` rápidos por ambos extremos. | Texto «To implement a queue, use collections.deque» | `tutorial/datastructures.html` |
| C05 | What does the `finally` clause of a `try` statement guarantee? | Se ejecuta como última tarea antes de que termine la sentencia `try`. | Párrafo «If a finally clause is present…» | `tutorial/errors.html` |
| C06 | What is the risk of calling `shutil.rmtree` on a symbolic link to a directory? | Si la ruta es un enlace seguido de barra final (`'link/'`), el sistema operativo resuelve el enlace: borra el contenido del directorio apuntado y luego falla al borrar el enlace. `pathlib.Path` quita las barras finales y `rmtree(Path('link/'))` rechaza el enlace. | Párrafo sobre `'link/'` en `shutil.rmtree` | `library/shutil.html` |
| C07 | How does `lazy import` work in Python 3.15 and where can it be used? | La palabra clave blanda `lazy` aplaza la carga del módulo hasta el primer uso del nombre. Solo vale a nivel de módulo: dentro de funciones, clases o `try/except/finally` da `SyntaxError`. Tampoco admite `import *` ni `__future__`. | Sección «PEP 810: Explicit lazy imports» | `whatsnew/3.15.html` |
| C08 | How do I enable lazy imports without changing the source code? | Con la opción `-X lazy_imports` o la variable `PYTHON_LAZY_IMPORTS`. Valores: `all` y `normal` (por defecto). | Párrafo sobre `-X lazy_imports` | `whatsnew/3.15.html` |
| C09 | What is new in Python 3.15 and when was it released? | Novedades principales: imports perezosos, `frozendict` y `sentinel`, UTF-8 por defecto, desempaquetado en comprensiones y ABI estable para builds free-threaded. Publicada el 9 de octubre de 2026. | Resumen «Release highlights» | `whatsnew/3.15.html` |

## D. Varias fuentes (k mín. 2)

La respuesta completa necesita información de dos páginas distintas. Con k=1 solo se obtiene la mitad.

| ID | Query (EN) | Respuesta esperada | Evidencia | Fuentes |
|---|---|---|---|---|
| D01 | How do I run an external command and convert its JSON output to a Python object? | `subprocess.run(..., capture_output=True, text=True)` para capturar la salida y `json.loads(...)` para decodificarla. | `capture_output` en subprocess y las funciones de carga de `json` | `library/subprocess.html`, `library/json.html` |
| D02 | How do I make a GET request and save the result to a file with `pathlib`? | Petición con `http.client` (`request("GET", ...)`, `getresponse()`) y escritura con `Path.write_text` o `Path.write_bytes`. | Ejemplo de GET y métodos de escritura de `Path` | `library/http.client.html`, `library/pathlib.html` |
| D03 | What should I use instead of `threading` for CPU-bound tasks, and what is the exact class called? | `multiprocessing` o `concurrent.futures.ProcessPoolExecutor`; la segunda se documenta en su propia página. | Recomendación en `threading` y definición de `ProcessPoolExecutor` | `library/threading.html`, `library/concurrent.futures.html` |

## E. Sin respuesta en el corpus (negativas)

El corpus no contiene la información. El sistema debe contestar «No encuentro esa información» y no inventar. Se ha comprobado que `FastAPI`, `PyTorch` y `Kubernetes` no aparecen en ningún HTML del corpus.

| ID | Query (EN) | Respuesta esperada |
|---|---|---|
| E01 | How do I define an endpoint with FastAPI? | «No encuentro esa información.» |
| E02 | How do I train a neural network with PyTorch? | «No encuentro esa información.» |
| E03 | How do I deploy an application on Kubernetes? | «No encuentro esa información.» |

## Cobertura

| Categoría | Preguntas | Qué mide |
|---|---|---|
| A. Consulta puntual | 10 | Calidad base de embeddings y chunk size; k=1. |
| B. Términos exactos | 10 | Necesidad de hybrid search (pregunta 6). |
| C. Conceptos | 9 | Chunk size: respuestas que ocupan un párrafo. |
| D. Varias fuentes | 3 | Si k=1 pierde información que k=2 recupera (pregunta 4). |
| E. Negativas | 3 | Fiabilidad ante preguntas sin respuesta (ruido de chunks grandes). |

Total: 35 preguntas.

## Pendiente

- Las fuentes de D01-D03 están indicadas a nivel de página. Falta fijar el chunk exacto una vez elegido el tamaño de chunk.
- Ampliar con preguntas formuladas por el equipo para evitar sesgo de quien las redacta.
- Cambiar el corpus (por ejemplo, otra versión de Python) obliga a revisar B04-B06 y C07-C09, que son específicas de 3.15.
