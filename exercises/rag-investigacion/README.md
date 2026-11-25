# rag-neoland

RAG local sobre la documentación oficial de **Python 3.15**, pensado para que un agente de programación consulte la API real antes de escribir código. El repositorio contiene el pipeline final, los notebooks y scripts de la investigación que justifica cada decisión, y el informe resultante.

## Configuración final

| Componente | Decisión |
|---|---|
| Idioma de recuperación | Corpus y query en inglés (el agente traduce si la conversación está en español) |
| Embeddings | `nomic-embed-text` en Ollama |
| Base vectorial | Qdrant 1.20.2 en Docker |
| Troceo | Markdown por estructura, máximo 1500 y mínimo 200 caracteres |
| Recuperación | 20 candidatos → reranking → 4 mejores chunks |
| Reranker | `cross-encoder/ms-marco-MiniLM-L-6-v2` |
| Búsqueda híbrida | No (solo densa) |
| Metadatos por chunk | `modulo`, `tipo_pagina`, `simbolos`, `deprecated`, `added_in`, `tiene_codigo` |

Resultado sobre el golden set (32 preguntas evaluables): **hit@4 = 0,938** y **ev_hit@4 = 0,813**. El detalle y la justificación de cada decisión están en [docs/COMPARATIVA_RAG_CONSOLIDADA.md](docs/COMPARATIVA_RAG_CONSOLIDADA.md).

## Requisitos

- [`uv`](https://docs.astral.sh/uv/) (única herramienta para gestionar el entorno; no uses `pip`)
- Python 3.14 (ver `.python-version`)
- [Docker](https://www.docker.com/) para Qdrant
- [Ollama](https://ollama.com/) con el modelo `nomic-embed-text`

## Puesta en marcha

```bash
uv sync                          # instala las dependencias
ollama pull nomic-embed-text     # modelo de embeddings
docker compose up -d             # Qdrant en localhost:6333
```

Crea un `.env` en la raíz con las claves que necesites (`OPENAI_API_KEY`, `COHERE_API_KEY`, `LANGSMITH_*`, `GITHUB_TOKEN`). El `.env` está en `.gitignore`.

El dashboard de Qdrant queda en <http://localhost:6333/dashboard>.

## Uso

Consultar el RAG desde la terminal (las queries van en inglés):

```bash
uv run python scripts/consultar_rag.py "How does asyncio.TaskGroup work?"
uv run python scripts/consultar_rag.py "How does asyncio.TaskGroup work?" --modulo asyncio
```

Devuelve los 4 mejores chunks en JSON. `--modulo` y `--tipo-pagina` filtran por metadatos; si el filtro no deja candidatos, la búsqueda se repite sin filtro. Con `--k` se ajusta el número de chunks.

Si la colección no tiene los metadatos (error por falta de `modulo`), añádelos sin recalcular vectores:

```bash
uv run python scripts/anadir_metadatos.py
```

Validar el pipeline completo contra el golden set:

```bash
uv run python scripts/validar_rag_final.py
```

Tests:

```bash
uv run pytest
```

## Estructura

```
.
├── notebooks/     # 01-05 primeros pasos; 06-13 comparativas de cada decisión
├── scripts/       # consultar_rag, indexación, metadatos, evaluación, preparación del corpus
├── tests/         # pytest sobre los scripts
├── data/
│   ├── python-docs-3.15/   # corpus (HTML original y Markdown limpio)
│   └── resultados/         # CSV y JSON de cada experimento
├── docs/          # fichas de investigación, golden set, comparativa final e informe
├── ejemplos/      # ejemplos de uso (analizador_logs, resumen_gastos)
└── docker-compose.yml      # servidor Qdrant
```

### Notebooks

| Notebook | Tema |
|---|---|
| 01-05 | Buscador semántico, comparar modelos, índice persistente con ChromaDB, pipeline RAG sobre PDF, embeddings y bases vectoriales |
| 06 | Tamaño de chunk |
| 07 | Troceo por estructura |
| 08 | Número de k |
| 09 | Reranking |
| 10 | Búsqueda híbrida |
| 11 | Troceo limitado |
| 12 | Filtros por metadatos |
| 13 | Modelos de embedding |

### Preparar el corpus desde cero

```bash
uv run --no-project --with markdownify --with beautifulsoup4 python -I scripts/html_a_md.py ORIGEN_HTML DESTINO_MD
uv run --no-project python -I scripts/limpiar_corpus_md.py ORIGEN DESTINO
uv run python scripts/indexar_embeddings.py --referencia   # registra la colección de nomic
```

Para indexar otros modelos de embedding (colección `pydocs_<clave>_est1500_m200_sinruta`): `uv run python scripts/indexar_embeddings.py qwen3_06b bge_m3`.

## Documentación de la investigación

- [TAREA_RAG_A_TEMPO.md](docs/TAREA_RAG_A_TEMPO.md): preguntas a resolver y decisiones.
- [COMPARATIVA_RAG_CONSOLIDADA.md](docs/COMPARATIVA_RAG_CONSOLIDADA.md): resultados y configuración final.
- [GOLDEN_SET_PYTHON_DOCS.md](docs/GOLDEN_SET_PYTHON_DOCS.md): 35 preguntas de evaluación.
- Fichas: [embeddings](docs/FICHA_01_EMBEDDINGS.md), [base vectorial](docs/FICHA_02_BASE_VECTORIAL.md), [reranking](docs/FICHA_03_RERANKING.md), [número k](docs/FICHA_04_NUMERO_K.md), [chunk size](docs/FICHA_05_CHUNK_SIZE.md), [hybrid](docs/FICHA_06_HYBRID.md), [filtros por metadatos](docs/FICHA_07_FILTROS_METADATOS.md), [modelos de embedding](docs/FICHA_08_MODELOS_EMBEDDING.md).
- Informe en PDF: [docs/informe/](docs/informe/).

## Flujo de trabajo

El proyecto usa el paquete `delivery-workflow` (instalado con `apm`). Rama base: `staging`; las ramas de trabajo se llaman `número-tipo-descripcion` y entran por pull request a `staging`, y de ahí a `main`. Detalles en [AGENTS.md](AGENTS.md).
