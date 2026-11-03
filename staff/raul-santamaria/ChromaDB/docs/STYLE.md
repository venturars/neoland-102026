# Estilo de código — ChromaDB

Paradigma **funcional y declarativo**, pensado para que un junior lea el flujo de arriba abajo sin saltos ocultos. El formato lo fija **Black**; el análisis estático, **Ruff** (ver `pyproject.toml` en la raíz del proyecto).

## Idioma

| Qué | Idioma |
| --- | --- |
| Código (nombres, strings en código) | Inglés |
| Mensajes en terminal (`print`, errores) | Inglés |
| Comentarios | Español, solo si algo no es evidente |
| Documentación en repo | Español salvo identificadores técnicos |

## Formato (Black)

- Longitud de línea: **88** (default de Black).
- Indentación: 4 espacios.
- Antes de cerrar una ronda de implementación, el developer ejecuta sobre los ficheros tocados:
  - `python -m black <ruta>`
  - `python -m ruff check <ruta>`
- Comandos completos: [COMMANDS.md](COMMANDS.md).

No se reformatea el repo entero en bloque salvo que una spec lo pida.

## Lint (Ruff)

- Configuración en `pyproject.toml`: reglas `E`, `F`, `I`, `UP`; `E501` ignorada (Black gestiona la longitud).
- `ruff check` debe pasar en los ficheros modificados antes de dar por cerrada la task.

## Estructura de un fichero Python

- **Un fichero, una función** (acción en `snake_case`: `split_doc`, `embed_texts`).
- Excepción: `scripts/settings.py` y `src/**/settings.py` solo constantes, sin funciones.
- **Sin clases**, salvo que una librería las exija.
- Imports al inicio: stdlib, luego terceros.
- Tipos en la firma de parámetros y retorno. Sin bloques de contrato encima de la función.
- Cada línea hace **una** acción.
- Errores: `if` en su propia línea y `raise RuntimeError("...")` con mensaje en inglés.
- Sin envoltorios de resultado, sin jerarquías de excepciones, sin helpers genéricos que oculten pasos.

Orden del cuerpo de la función:

1. Validar parámetros de entrada.
2. Validar el resto de reglas.
3. Aplicar la lógica.
4. Estructurar la salida.

## Convenciones de nombres

- Ficheros, funciones, variables: `snake_case`.
- Constantes: `MAYÚSCULAS` (`MODEL`, `BATCH_SIZE`).

## Consulta de la documentación Python

Antes de escribir o cambiar Python, usar la skill [`skills/python-docs/SKILL.md`](../skills/python-docs/SKILL.md) (índice RAG local).

## Dónde aplica

- Pipeline RAG: `scripts/` (un fichero por acción).
- CRUD usuarios: `src/` por capas (ver [ARCHITECTURE.md](ARCHITECTURE.md)).
