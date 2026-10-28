---

name: python-docs
description: >-
  Look up the official Python documentation in a local RAG before writing,
  reviewing or explaining Python code. The index is the version downloaded
  for this project. Use it to check that a module, function, class, parameter
  or command-line option exists in that version and how it behaves, and to
  find what is new, changed or deprecated in it.
allowed-tools: Bash

---

# Python docs

A local index of the official Python documentation for the version downloaded in this project (about 11,000 chunks). Use it instead of your memory: your training data may describe another version.

## Requirements

- Run the commands from the repository root.
- Ollama must be running (`ollama serve`, or the Ollama app). `search.py` needs it; `get_doc.py` does not.
- The index must exist. If a command says `Index not found`, ask the user to run `scripts/build_index.py` (see `exercises/ChromaDB/README.md`). Do not build it yourself without asking: it takes several minutes.

`PY` below is the project Python:

- Windows: `exercises/ChromaDB/.venv/Scripts/python.exe`
- macOS / Linux: `exercises/ChromaDB/.venv/bin/python`

## Workflow

1. **Search by meaning** when you do not know the exact name:

   ```bash
   PY exercises/ChromaDB/scripts/search.py "read the contents of a text file"
   ```

2. **Confirm by exact name** before you use a function, class or option in code:

   ```bash
   PY exercises/ChromaDB/scripts/get_doc.py pathlib.Path.read_text
   ```

   If it prints `not found in Python 3.15 docs` (the number is the downloaded version), do not use that name. Search again.

3. **Cite the source** (`page#anchor`) next to the code or in your answer, so the user can check it.

## search.py

```bash
PY exercises/ChromaDB/scripts/search.py "question" [-n 5] [--area AREA] [--module MODULE] [--kind KIND]
```

- Write the question in English, describing what you want to do.
- `-n`: number of results (default 5). Use more if the first results do not answer.
- `--module`: only one module (`pathlib`, `json`, `asyncio`...). Use it only when you are sure of the module.
- `--area`: `library` (modules), `builtins` (built-in functions and types), `reference` (language), `c-api`, `tutorial`, `howto`, `using` (command line, install), `extending`, `faq`, `glossary`, `deprecations`, `whatsnew`.
- `--kind`: `api` (a function, class, option...), `guide` (explanations), `whatsnew` (what is new in the downloaded version), `changelog` (single changes in that version), `deprecation` (what will be removed).

If you are not sure about a filter, search without it. A wrong filter returns nothing useful.

## get_doc.py

```bash
PY exercises/ChromaDB/scripts/get_doc.py NAME
```

`NAME` is the full name used in the docs:

| What                     | Name                                     |
| ------------------------ | ---------------------------------------- |
| Python function or class | `pathlib.Path.read_text`, `json.dumps`   |
| Built-in                 | `open`, `str.split`, `dict.get`          |
| C API                    | `c.PyList_New`                           |
| Command-line option      | `cmdoption-c`, `cmdoption-X`             |
| Environment variable     | `envvar-PYTHONPATH`                      |
| Glossary term            | `term-generator`                         |

Take the names from the `source:` line that `search.py` prints.

## Reading the output

```
===== [1] distance 0.180
source: library/pathlib.html#pathlib.Path.open

pathlib — Object-oriented filesystem paths > Concrete paths > Reading and writing files > Path.open(...)

#### `Path.open(mode='r', ...)`
...
```

- `distance`: lower is closer to the question. Good results are usually below 0.45; above 0.5 they are usually not related.
- `source`: page and anchor of the chunk. It is what you cite.
- The first line of the text is where the chunk is in the docs. Then comes the documentation itself, in Markdown.
- `Added in version`, `Changed in version` and `Deprecated` lines tell you since when something exists.

## Rules

- The documentation is the source of truth for the downloaded Python version. If it disagrees with what you remember, follow the documentation.
- If neither command finds it, say that you could not confirm it in those docs. Do not invent it.
