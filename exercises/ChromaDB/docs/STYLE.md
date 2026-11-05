# Estilo — ChromaDB

El código se escribe para que un junior pueda leerlo de arriba abajo. Es funcional y declarativo: una función hace una acción, y cada línea también.

Black formatea. Ruff avisa. Ninguno de los dos decide la arquitectura.

## Lengua y nombres

- El código se escribe en inglés. Los comentarios van en español y solo donde algo no es evidente.
- Los mensajes que se ven en la terminal van en inglés.
- Ficheros, funciones y variables en `snake_case`. Las constantes en mayúsculas (`MODEL`).
- Los parámetros y la salida llevan tipos en la firma. No hay comentario de contrato encima de la función.

## Cómo se escribe una función

- No hay clases, salvo que una librería las pida.
- Cada línea hace una sola acción.
- Un fallo se comprueba con `if` y `raise RuntimeError("...")`, en su propia línea.
- Se escribe como lo escribiría un junior a mano: sin envoltorios de resultado, sin clases de error, sin helpers genéricos y sin abstracciones que oculten los pasos.
- Los imports van al principio, en tres grupos separados por una línea en blanco: primero la biblioteca estándar, después las dependencias, después lo local.

El cuerpo sigue este orden, sin mezclarlo:

1. Validar los parámetros de entrada.
2. Validar el resto de reglas.
3. Aplicar la lógica.
4. Estructurar la salida.

## Un fichero

Un fichero de código contiene una función. Su nombre es la acción (`split_doc`, `embed_texts`, `create_user`).

Los `settings.py` solo guardan constantes. No tienen funciones.

## Tests

Un módulo de test por función de producción: `tests/test_<funcion>.py`. Dentro, una función `test_` por escenario de la spec. Varias funciones de test en ese módulo son casos de la misma acción.

`code_tester` los escribe. Black y Ruff también se aplican a `tests/`.

## Black

Formatea `scripts/` y `src/`. Longitud de línea 79, que es la de PEP 8. Cuatro espacios. El objetivo de sintaxis es Python 3.10.

No formatea notebooks. No entra en `.venv/`, `chroma_db/`, `python-docs/`, `python-docs-md/` ni `chromadash/`.

Ruff tampoco entra en los notebooks: la celda que prepara `sys.path` importa `sdk` después, a propósito.

Black no vigila «sin clases» ni «un fichero, una función». Eso lo comprueban los agentes al leer este fichero.

Desde `exercises/ChromaDB`, con el entorno activo:

```bash
python -m black scripts src tests
python -m black --check scripts src tests
```

## Ruff

Solo avisa: `ruff check`. No se usa `ruff format`, porque ese comando sustituye a Black y no debe alternarse con él.

Reglas: `E` (pycodestyle), `F` (pyflakes) e `I` (isort). No se activan las de docstrings: este estilo no pone un contrato encima de la función.

isort mantiene los tres grupos de imports. La longitud de línea es la misma que la de Black, 79.

```bash
python -m ruff check scripts src tests
```
